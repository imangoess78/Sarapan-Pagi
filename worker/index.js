/**
 * Lapak Jajan Sarapan Pagi Bintaro — Cloudflare Worker
 * REST API + serve static HTML frontend
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function nanoid() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // Serve static frontend from /public via ASSETS binding
    if (!pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    const db = env.DB;

    try {
      // ─── KONSINYATOR ──────────────────────────────────────────────
      if (pathname === '/api/konsinyator') {
        if (request.method === 'GET') {
          const { results } = await db.prepare(
            'SELECT * FROM konsinyator ORDER BY created_at DESC'
          ).all();
          return json(results);
        }
        if (request.method === 'POST') {
          const body = await request.json();
          const id = 'k' + nanoid();
          await db.prepare(
            'INSERT INTO konsinyator (id, nama, hp, created_at) VALUES (?, ?, ?, date("now"))'
          ).bind(id, body.nama, body.hp).run();
          return json({ id, nama: body.nama, hp: body.hp }, 201);
        }
      }

      const mKonsinyator = pathname.match(/^\/api\/konsinyator\/([^/]+)$/);
      if (mKonsinyator) {
        const id = mKonsinyator[1];
        if (request.method === 'PUT') {
          const body = await request.json();
          await db.prepare(
            'UPDATE konsinyator SET nama=?, hp=? WHERE id=?'
          ).bind(body.nama, body.hp, id).run();
          return json({ ok: true });
        }
        if (request.method === 'DELETE') {
          await db.prepare('DELETE FROM konsinyator WHERE id=?').bind(id).run();
          return json({ ok: true });
        }
      }

      // ─── PRODUK ───────────────────────────────────────────────────
      if (pathname === '/api/produk') {
        if (request.method === 'GET') {
          const konsinyatorId = url.searchParams.get('konsinyator_id');
          let q = 'SELECT p.*, k.nama as konsinyator_nama FROM produk p JOIN konsinyator k ON p.konsinyator_id = k.id';
          const params = [];
          if (konsinyatorId) { q += ' WHERE p.konsinyator_id=?'; params.push(konsinyatorId); }
          q += ' ORDER BY p.nama';
          const { results } = await db.prepare(q).bind(...params).all();
          return json(results);
        }
        if (request.method === 'POST') {
          const body = await request.json();
          const id = 'p' + nanoid();
          await db.prepare(
            'INSERT INTO produk (id, konsinyator_id, nama, harga) VALUES (?, ?, ?, ?)'
          ).bind(id, body.konsinyator_id, body.nama, body.harga).run();
          return json({ id, ...body }, 201);
        }
      }

      const mProduk = pathname.match(/^\/api\/produk\/([^/]+)$/);
      if (mProduk) {
        const id = mProduk[1];
        if (request.method === 'PUT') {
          const body = await request.json();
          await db.prepare(
            'UPDATE produk SET nama=?, harga=?, konsinyator_id=? WHERE id=?'
          ).bind(body.nama, body.harga, body.konsinyator_id, id).run();
          return json({ ok: true });
        }
        if (request.method === 'DELETE') {
          await db.prepare('DELETE FROM produk WHERE id=?').bind(id).run();
          return json({ ok: true });
        }
      }

      // ─── TRANSAKSI ────────────────────────────────────────────────
      if (pathname === '/api/transaksi') {
        if (request.method === 'GET') {
          const tanggal = url.searchParams.get('tanggal');
          const konsinyatorId = url.searchParams.get('konsinyator_id');
          let q = `SELECT t.*, p.nama as produk_nama, k.nama as konsinyator_nama
                   FROM transaksi t
                   JOIN produk p ON t.produk_id = p.id
                   JOIN konsinyator k ON t.konsinyator_id = k.id`;
          const params = [];
          const wheres = [];
          if (tanggal) { wheres.push('t.tanggal=?'); params.push(tanggal); }
          if (konsinyatorId) { wheres.push('t.konsinyator_id=?'); params.push(konsinyatorId); }
          if (wheres.length) q += ' WHERE ' + wheres.join(' AND ');
          q += ' ORDER BY t.created_at DESC';
          const { results } = await db.prepare(q).bind(...params).all();
          return json(results);
        }
        if (request.method === 'POST') {
          const body = await request.json();
          const id = 't' + nanoid();
          const total = body.qty * body.harga;
          const bagi_hasil = Math.round(total * 0.10); // 10% bagi hasil lapak
          const setoran = total - bagi_hasil;
          await db.prepare(
            `INSERT INTO transaksi (id, produk_id, konsinyator_id, qty, harga, total, bagi_hasil, setoran, tanggal, paid)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, date('now'), 0)`
          ).bind(id, body.produk_id, body.konsinyator_id, body.qty, body.harga, total, bagi_hasil, setoran).run();
          return json({ id, total, bagi_hasil, setoran }, 201);
        }
      }

      const mTrx = pathname.match(/^\/api\/transaksi\/([^/]+)$/);
      if (mTrx) {
        const id = mTrx[1];
        if (request.method === 'PUT') {
          const body = await request.json();
          if (body.paid !== undefined) {
            await db.prepare('UPDATE transaksi SET paid=? WHERE id=?').bind(body.paid ? 1 : 0, id).run();
          } else {
            const total = body.qty * body.harga;
            const bagi_hasil = Math.round(total * 0.10);
            const setoran = total - bagi_hasil;
            await db.prepare(
              'UPDATE transaksi SET qty=?, harga=?, total=?, bagi_hasil=?, setoran=? WHERE id=?'
            ).bind(body.qty, body.harga, total, bagi_hasil, setoran, id).run();
          }
          return json({ ok: true });
        }
        if (request.method === 'DELETE') {
          await db.prepare('DELETE FROM transaksi WHERE id=?').bind(id).run();
          return json({ ok: true });
        }
      }

      // ─── RINGKASAN / SUMMARY ──────────────────────────────────────
      if (pathname === '/api/ringkasan') {
        const tanggal = url.searchParams.get('tanggal') || new Date().toISOString().slice(0, 10);
        const { results } = await db.prepare(`
          SELECT
            k.id, k.nama, k.hp,
            COUNT(t.id) as jml_transaksi,
            SUM(t.total) as total_penjualan,
            SUM(t.bagi_hasil) as total_bagi_hasil,
            SUM(t.setoran) as total_setoran,
            SUM(CASE WHEN t.paid=1 THEN t.setoran ELSE 0 END) as sudah_bayar,
            SUM(CASE WHEN t.paid=0 THEN t.setoran ELSE 0 END) as belum_bayar
          FROM konsinyator k
          LEFT JOIN transaksi t ON t.konsinyator_id=k.id AND t.tanggal=?
          GROUP BY k.id
          ORDER BY k.nama
        `).bind(tanggal).all();

        const totals = results.reduce((acc, r) => ({
          total_penjualan: acc.total_penjualan + (r.total_penjualan || 0),
          total_bagi_hasil: acc.total_bagi_hasil + (r.total_bagi_hasil || 0),
          total_setoran: acc.total_setoran + (r.total_setoran || 0),
          sudah_bayar: acc.sudah_bayar + (r.sudah_bayar || 0),
          belum_bayar: acc.belum_bayar + (r.belum_bayar || 0),
        }), { total_penjualan: 0, total_bagi_hasil: 0, total_setoran: 0, sudah_bayar: 0, belum_bayar: 0 });

        return json({ tanggal, konsinyator: results, totals });
      }

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};
