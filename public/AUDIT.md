# AUDIT REPORT — admin-v2 vs admin.html + worker/index.js

**Date:** 2026-08-06  
**Auditor:** Kiro (automated inspection)  
**Ground truth for API:** `worker/index.js`  
**Ground truth for client logic:** `admin.html` (bundled React, in-memory demo)  
**Implementation under review:** `public/admin-v2/`

---

## CRITICAL FINDING: admin.html Has No Real API Calls

After full inspection of `admin.html`, the bundled React app uses **100% in-memory state** (hardcoded demo data). There are no `fetch()` calls, no authentication, no JWT, no `/api/*` routes. It is a pure UI demo.

The **real business logic** lives entirely in `worker/index.js`.

This changes the audit basis: `admin-v2` must be compared against `worker/index.js` as the source of truth, not `admin.html`.

---

## SECTION 1 — AUTHENTICATION

### Worker (`worker/index.js`)
**Finding:** The worker has **NO `/api/login` endpoint**. There is no authentication handler of any kind in the 242-line file. No JWT, no password check, no token issuance.

### admin-v2 implementation (`js/api.js`, `js/auth.js`)
```js
// api.js
login(password) {
  return API.request('POST', '/api/login', { password });
}

// auth.js
const data = await API.login(pw);
Auth.setToken(data.token);
```

### Verdict: ❌ DIVERGENCE
`admin-v2` calls `POST /api/login` with `{ password }` and expects `{ token }` in response.  
The worker does not implement this endpoint — it will return `{ error: "not found" }` with HTTP 404.

**Impact:** Login will always fail in production. The entire app is inaccessible.

---

## SECTION 2 — ENDPOINTS

### Worker actual endpoints vs admin-v2 assumed endpoints

| Feature | Worker endpoint | admin-v2 endpoint | Match? |
|---------|----------------|-------------------|--------|
| Login | ❌ Not implemented | `POST /api/login` | ❌ |
| List products | `GET /api/produk` | `GET /api/products` | ❌ |
| Create product | `POST /api/produk` | `POST /api/products` | ❌ |
| Update product | `PUT /api/produk/:id` | `PUT /api/products/:id` | ❌ |
| Delete product | `DELETE /api/produk/:id` | `DELETE /api/products/:id` | ❌ |
| Upload image | ❌ Not implemented | `POST /api/upload` | ❌ |
| Konsinyator list | `GET /api/konsinyator` | Not implemented | ❌ |
| Konsinyator create | `POST /api/konsinyator` | Not implemented | ❌ |
| Konsinyator update | `PUT /api/konsinyator/:id` | Not implemented | ❌ |
| Konsinyator delete | `DELETE /api/konsinyator/:id` | Not implemented | ❌ |
| Transactions | `GET/POST /api/transaksi` | Not implemented | ❌ |
| Mark paid | `PATCH /api/transaksi/:id/paid` | Not implemented | ❌ |
| Delete transaction | `DELETE /api/transaksi/:id` | Not implemented | ❌ |
| Orders | `GET/POST /api/pesanan` | Not implemented | ❌ |
| Update order status | `PATCH /api/pesanan/:id/status` | Not implemented | ❌ |

**Summary: 0 out of 15 endpoints are correctly mapped.**

---

## SECTION 3 — PAYLOADS

### Products: Worker vs admin-v2

**Worker `POST /api/produk` expects:**
```json
{
  "konsinyator_id": "string",
  "nama": "string",
  "harga": number,
  "stok": number
}
```

**admin-v2 `POST /api/products` sends:**
```json
{
  "name": "string",
  "price": number,
  "stock": number,
  "category": "string",
  "consignor_name": "string",
  "consignor_phone": "string",
  "image_url": "string|null"
}
```

**Verdict: ❌ Completely different field names and structure.**

- Worker uses `nama`, `harga`, `stok`, `konsinyator_id` (references a separate konsinyator entity).
- admin-v2 uses `name`, `price`, `stock`, `category`, `consignor_name`, `consignor_phone`, `image_url` (embeds consignor inline).
- Worker requires a separate `konsinyator_id` (must create konsinyator first). admin-v2 has no concept of this.

**Worker `PUT /api/produk/:id` expects:**
```json
{
  "nama": "string",
  "harga": number,
  "stok_sisa": number,
  "stok_awal": number  // optional
}
```

**admin-v2 sends same payload as create.** ❌ Field names differ.

---

## SECTION 4 — RESPONSE FORMATS

**Worker `GET /api/produk` returns:**
```json
[
  {
    "id": "abc123",
    "konsinyator_id": "c1",
    "nama": "Nasi Uduk",
    "harga": 15000,
    "stok_awal": 20,
    "stok_sisa": 8,
    "terjual": 12
  }
]
```

**admin-v2 `loadProducts()` in `app.js` handles:**
```js
const list = Array.isArray(data) ? data : (data.products || []);
// Then renders: p.name, p.price, p.stock, p.consignor_name, p.consignor_phone, p.image_url
```

**Verdict: ❌ Field name mismatch.**

- Worker returns `nama`, admin-v2 renders `p.name` → all product names will be `undefined`.
- Worker returns `harga`, admin-v2 renders `p.price` → all prices will be `undefined`.
- Worker returns `stok_sisa`, admin-v2 renders `p.stock` → all stock counts will be `undefined`.
- Worker has no `consignor_name`, `consignor_phone`, `image_url`, `category` fields.

---

## SECTION 5 — SCHEMA (Database)

From `worker/index.js` SQL statements, the actual schema uses:

**`konsinyator` table:** `id, nama, hp, created_at`  
**`produk` table:** `id, konsinyator_id, nama, harga, stok_awal, stok_sisa, terjual`  
**`transaksi` table:** `id, produk_id, konsinyator_id, qty, harga, total, bagi_hasil, setoran, tanggal, paid`  
**`pesanan` table:** `id, customer_name, wa, product_name, qty, catatan, status, tanggal`

admin-v2 assumes a flat `products` table with embedded consignor data, no `transaksi` table, no `pesanan` table.

**Verdict: ❌ Schema model is completely different.**

---

## SECTION 6 — MISSING FEATURES IN admin-v2

The following worker capabilities are entirely absent from admin-v2:

| Feature | Worker | admin-v2 |
|---------|--------|----------|
| Konsinyator CRUD | ✅ Full | ❌ Missing |
| Transaction recording | ✅ `POST /api/transaksi` | ❌ Missing |
| Mark transactions paid | ✅ `PATCH /api/transaksi/:id/paid` | ❌ Missing |
| Delete transaction (restores stock) | ✅ | ❌ Missing |
| Order management | ✅ Full CRUD + status | ❌ Missing |
| Per-konsinyator transaction history | ✅ `GET /api/transaksi?konsinyator_id=` | ❌ Missing |

---

## SECTION 7 — SEARCH & PAGINATION

**Worker:** Search and pagination are **not implemented server-side**. The worker returns all records in a single response. No `?q=`, `?page=`, `?limit=` parameters exist.

**admin-v2:** Implements client-side search and pagination correctly as a client-side filter over all records.

**Verdict: ✅ Approach is correct** (client-side filtering over full dataset matches what the worker returns), but it is irrelevant because the data never loads due to endpoint mismatch.

---

## SECTION 8 — IMAGE UPLOAD

**Worker:** Has **no `/api/upload` endpoint**. Not implemented.

**admin-v2:** Calls `POST /api/upload` with `FormData`. Will always 404.

**Verdict: ❌ Feature does not exist in backend.**

---

## SECTION 9 — STATE ARCHITECTURE

**admin-v2 `State` object** models:
```
products: []   // flat array with embedded consignor data
filtered: []
currentPage: number
pageSize: 12
searchQuery: string
```

**Worker data model** requires two separate entities:
```
konsinyator: { id, nama, hp }
produk: { id, konsinyator_id, nama, harga, stok_awal, stok_sisa, terjual }
```

**Verdict: ❌ State model does not match backend data model.**

---

## SUMMARY TABLE

| Area | Status | Severity |
|------|--------|----------|
| Authentication endpoint | ❌ Does not exist in worker | BLOCKER |
| Product endpoint names | ❌ `/api/products` vs `/api/produk` | BLOCKER |
| Product payload field names | ❌ `name/price/stock` vs `nama/harga/stok` | BLOCKER |
| Product response field names | ❌ Rendered fields don't match response | BLOCKER |
| Konsinyator entity | ❌ Not implemented in admin-v2 | BLOCKER |
| Transactions | ❌ Not implemented in admin-v2 | HIGH |
| Orders | ❌ Not implemented in admin-v2 | HIGH |
| Image upload endpoint | ❌ Does not exist in worker | HIGH |
| State data model | ❌ Flat vs relational | BLOCKER |
| Client-side search logic | ✅ Correct approach | PASS |
| Pagination approach | ✅ Correct approach | PASS |
| UI layout & visual design | ✅ Matches reference | PASS |

---

## CONCLUSION

**The admin-v2 implementation is NOT functionally equivalent to the worker API.**

The implementation was built assuming a different API contract (single-entity products with embedded consignor data, English field names, `/api/products` path, JWT authentication, image upload). The actual worker uses a relational model with Indonesian field names, Indonesian URL paths (`/api/produk`, `/api/konsinyator`), no authentication, and no image upload.

### Required fixes to reach parity:

1. **Remove authentication** — the worker has no login endpoint.
2. **Rename all endpoints**: `/api/products` → `/api/produk`, etc.
3. **Rename all payload fields**: `name→nama`, `price→harga`, `stock→stok_sisa`, etc.
4. **Add konsinyator CRUD** as a separate entity (required before creating products).
5. **Add transaction recording** via `POST /api/transaksi`.
6. **Add mark-paid** via `PATCH /api/transaksi/:id/paid`.
7. **Add order management** via `/api/pesanan`.
8. **Remove image upload** (not in worker) or add it to the worker.
9. **Refactor state model** to handle two entities (konsinyator + produk) separately.
10. **Fix response parsing** to use `nama`, `harga`, `stok_sisa`, `terjual` field names.
