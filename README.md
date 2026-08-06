# 🍱 Lapak Jajan Sarapan Pagi Bintaro

Sistem manajemen konsinyasi berbasis **Cloudflare Workers + D1 Database** — gratis deploy, gratis database, full CRUD.

## 🚀 Fitur

- ✅ **Dashboard** — ringkasan penjualan harian per konsinyator, export CSV, salin ringkasan WhatsApp
- ✅ **Transaksi** — catat penjualan, auto-hitung bagi hasil 10%, mark paid/unpaid
- ✅ **Produk** — manage katalog produk per konsinyator
- ✅ **Konsinyator** — manage data konsinyator + QR DANA untuk transfer
- ✅ **Database D1** — SQLite edge-based, auto-replicated
- ✅ **100% Gratis** — Cloudflare Free Tier (100k req/day, 5 GB D1)

## 📦 Tech Stack

- **Backend:** Cloudflare Worker (JavaScript)
- **Database:** Cloudflare D1 (SQLite)
- **Frontend:** React 18 + Tailwind CSS (single HTML)
- **Deploy:** `wrangler deploy` — live in <2 menit

## 🛠 Setup & Deploy

### 1. Clone repo
```bash
git clone https://github.com/imangoess78/Sarapan-Pagi.git
cd Sarapan-Pagi
npm install
```

### 2. Buat D1 Database
```bash
npm run db:create
```
Copy **database_id** yang muncul, paste ke `wrangler.jsonc` line 12:
```jsonc
"database_id": "paste-id-disini"
```

### 3. Jalankan Schema + Seed
```bash
npm run db:schema
npm run db:seed
```

### 4. Deploy ke Cloudflare Workers
```bash
npm run deploy
```

Selesai! Akses via URL yang muncul (contoh: `https://sarapan-pagi.your-subdomain.workers.dev`)

## 📝 Development Lokal

```bash
npm run dev
```
Buka `http://localhost:8787` — database lokal otomatis dibuat di `.wrangler/state/`.

## 🗂 Struktur Folder

```
Sarapan-Pagi/
├── worker/
│   └── index.js          # REST API (konsinyator, produk, transaksi, ringkasan)
├── public/
│   └── index.html        # Frontend React + Tailwind (single file)
├── schema.sql            # D1 schema (konsinyator, produk, transaksi)
├── seed.sql              # Data awal dummy
├── wrangler.jsonc        # Cloudflare Worker config
└── package.json
```

## 🔑 API Endpoints

| Method | Path | Deskripsi |
|--------|------|-----------|
| `GET` | `/api/konsinyator` | List semua konsinyator |
| `POST` | `/api/konsinyator` | Tambah konsinyator baru |
| `PUT` | `/api/konsinyator/:id` | Update konsinyator |
| `DELETE` | `/api/konsinyator/:id` | Hapus konsinyator |
| `GET` | `/api/produk` | List semua produk |
| `POST` | `/api/produk` | Tambah produk baru |
| `GET` | `/api/transaksi?tanggal=YYYY-MM-DD` | List transaksi per tanggal |
| `POST` | `/api/transaksi` | Catat transaksi baru |
| `PUT` | `/api/transaksi/:id` | Update transaksi (qty, paid status) |
| `GET` | `/api/ringkasan?tanggal=YYYY-MM-DD` | Ringkasan penjualan per konsinyator |

## 💡 Tips

- **Bagi Hasil:** Default 10% untuk lapak, bisa diubah di `worker/index.js` line 142 (`bagi_hasil = total * 0.10`)
- **QR DANA:** Auto-generate dari nomor HP konsinyator
- **CSV Export:** Download ringkasan harian ke Excel/Sheets
- **Salin Ringkasan:** Format siap kirim ke WhatsApp group

## 📄 License

ISC
