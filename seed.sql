-- Seed data awal — Lapak Jajan Sarapan Pagi Bintaro
-- Run: npx wrangler d1 execute sarapan-pagi-db --remote --file=seed.sql

INSERT OR IGNORE INTO konsinyator (id, nama, hp, created_at) VALUES
  ('c1', 'Ibu Siti',  '081234567890', '2024-11-10'),
  ('c2', 'Pak Joko',  '082198765432', '2024-11-12');

INSERT OR IGNORE INTO produk (id, konsinyator_id, nama, harga, stok_awal, stok_sisa, terjual) VALUES
  ('p1', 'c1', 'Nasi Uduk Komplit',   15000, 20, 8,  12),
  ('p2', 'c1', 'Lontong Sayur',       18000, 15, 5,  10),
  ('p3', 'c2', 'Kopi Susu Gula Aren', 12000, 30, 18, 12),
  ('p4', 'c2', 'Gorengan Mix (3pcs)', 10000, 40, 15, 25);

INSERT OR IGNORE INTO transaksi (id, produk_id, konsinyator_id, qty, harga, total, bagi_hasil, setoran, tanggal, paid) VALUES
  ('s1', 'p1', 'c1', 2, 15000, 30000, 3000, 27000, date('now'), 0),
  ('s2', 'p4', 'c2', 5, 10000, 50000, 5000, 45000, date('now'), 1),
  ('s3', 'p3', 'c2', 3, 12000, 36000, 3600, 32400, date('now','-1 day'), 0),
  ('s4', 'p2', 'c1', 1, 18000, 18000, 1800, 16200, date('now','-1 day'), 0);

INSERT OR IGNORE INTO pesanan (id, customer_name, wa, product_name, qty, catatan, status, tanggal) VALUES
  ('o1', 'Bu Rina', '081211122233', 'Nasi Uduk Komplit x5 untuk rapat RT', 5, 'Pedas dipisah, jam 7 pagi', 'baru', date('now')),
  ('o2', 'Mas Andi', '082233344455', 'Gorengan Mix', 10, 'Untuk arisan', 'siap', date('now'));
