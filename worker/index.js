/**
 * Lapak Jajan Sarapan Pagi Bintaro — Cloudflare Worker API
 * Binding: DB (D1 database: sarapan-pagi-db)
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');
    const method = request.method;
    const DB = env.DB;

    try {
      // ── KONSINYATOR ──────────────────────────────────────────────────────
      if (path === '/api/konsinyator') {
        if (method === 'GET') {
          const { results } = await DB.prepare(
            'SELECT * FROM konsinyator ORDER BY created_at DESC'
          ).all();
          return json(results);
        }
        if (method === 'POST') {
          const { nama, hp } = await request.json();
          if (!nama || !hp) return json({ error: 'nama & hp wajib' }, 400);
          const id = uid();
          await DB.prepare(
            'INSERT INTO konsinyator (id,nama,hp,created_at) VALUES (?,?,?,?)'
          ).bind(id, nama.trim(), hp.trim(), today()).run();
          return json({ id, nama, hp, created_at: today() }, 201);
        }
      }

      const mKons = path.match(/^\/api\/konsinyator\/([^/]+)$/);
      if (mKons) {
        const id = mKons[1];
        if (method === 'DELETE') {
          await DB.prepare('DELETE FROM konsinyator WHERE id=?').bind(id).run();
          return json({ ok: true });
        }
      }

      // ── PRODUK ───────────────────────────────────────────────────────────
      if (path === '/api/produk') {
        if (method === 'GET') {
          const { results } = await DB.prepare(
            'SELECT * FROM produk ORDER BY rowid DESC'
          ).all();
          return json(results);
        }
        if (method === 'POST') {
          const { konsinyator_id, nama, harga, stok } = await request.json();
          if (!konsinyator_id || !nama || !harga || !stok)
            return json({ error: 'lengkapi semua field' }, 400);
          const id = uid();
          const n = Number(stok);
          await DB.prepare(
            'INSERT INTO produk (id,konsinyator_id,nama,harga,stok_awal,stok_sisa,terjual) VALUES (?,?,?,?,?,?,0)'
          ).bind(id, konsinyator_id, nama.trim(), Number(harga), n, n).run();
          return json({ id, konsinyator_id, nama, harga: Number(harga), stok_awal: n, stok_sisa: n, terjual: 0 }, 201);
        }
      }

      const mProd = path.match(/^\/api\/produk\/([^/]+)$/);
      if (mProd) {
        const id = mProd[1];
        if (method === 'PUT') {
          const { nama, harga, stok_sisa } = await request.json();
          await DB.prepare(
            'UPDATE produk SET nama=?, harga=?, stok_sisa=? WHERE id=?'
          ).bind(nama, Number(harga), Number(stok_sisa), id).run();
          return json({ ok: true });
        }
        if (method === 'DELETE') {
          await DB.prepare('DELETE FROM produk WHERE id=?').bind(id).run();
          return json({ ok: true });
        }
      }

      // ── TRANSAKSI ────────────────────────────────────────────────────────
      if (path === '/api/transaksi') {
        if (method === 'GET') {
          const { results } = await DB.prepare(
            'SELECT * FROM transaksi ORDER BY created_at DESC'
          ).all();
          return json(results);
        }
        if (method === 'POST') {
          const { produk_id, qty } = await request.json();
          const produk = await DB.prepare('SELECT * FROM produk WHERE id=?').bind(produk_id).first();
          if (!produk) return json({ error: 'produk tidak ditemukan' }, 404);
          const q = Number(qty);
          if (q <= 0 || q > produk.stok_sisa) return json({ error: `stok tidak cukup (sisa ${produk.stok_sisa})` }, 400);
          const total = q * produk.harga;
          const bagi_hasil = Math.round(total * 0.1);
          const setoran = total - bagi_hasil;
          const id = uid();
          await DB.batch([
            DB.prepare('INSERT INTO transaksi (id,produk_id,konsinyator_id,qty,harga,total,bagi_hasil,setoran,tanggal,paid) VALUES (?,?,?,?,?,?,?,?,?,0)')
              .bind(id, produk_id, produk.konsinyator_id, q, produk.harga, total, bagi_hasil, setoran, today()),
            DB.prepare('UPDATE produk SET stok_sisa=stok_sisa-?, terjual=terjual+? WHERE id=?')
              .bind(q, q, produk_id),
          ]);
          return json({ id, produk_id, konsinyator_id: produk.konsinyator_id, qty: q, harga: produk.harga, total, bagi_hasil, setoran, tanggal: today(), paid: 0 }, 201);
        }
      }

      const mTrx = path.match(/^\/api\/transaksi\/([^/]+)\/paid$/);
      if (mTrx && method === 'PATCH') {
        const konsinyator_id = mTrx[1];
        await DB.prepare('UPDATE transaksi SET paid=1 WHERE konsinyator_id=? AND paid=0').bind(konsinyator_id).run();
        return json({ ok: true });
      }

      // ── PESANAN ──────────────────────────────────────────────────────────
      if (path === '/api/pesanan') {
        if (method === 'GET') {
          const { results } = await DB.prepare(
            'SELECT * FROM pesanan ORDER BY created_at DESC'
          ).all();
          return json(results);
        }
        if (method === 'POST') {
          const { customer_name, wa, product_name, qty, catatan } = await request.json();
          if (!customer_name || !product_name) return json({ error: 'customer_name & product_name wajib' }, 400);
          const id = uid();
          await DB.prepare(
            'INSERT INTO pesanan (id,customer_name,wa,product_name,qty,catatan,status,tanggal) VALUES (?,?,?,?,?,?,?,?)'
          ).bind(id, customer_name.trim(), (wa||'').trim(), product_name.trim(), Number(qty)||1, (catatan||'').trim(), 'baru', today()).run();
          return json({ id, customer_name, wa, product_name, qty: Number(qty)||1, catatan, status: 'baru', tanggal: today() }, 201);
        }
      }

      const mPes = path.match(/^\/api\/pesanan\/([^/]+)\/status$/);
      if (mPes && method === 'PATCH') {
        const id = mPes[1];
        const { status } = await request.json();
        await DB.prepare('UPDATE pesanan SET status=? WHERE id=?').bind(status, id).run();
        return json({ ok: true });
      }

      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  },
};
