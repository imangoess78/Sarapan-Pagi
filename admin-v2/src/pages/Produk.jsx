/**
 * Produk page
 * - Fetches all products via produkService
 * - Client-side search by name
 * - Paginated product grid (12 per page)
 * - Loading skeleton and empty state
 * - ProdukModal: Create (POST) and Update (PUT) with exact worker payloads
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Spinner from '../components/ui/Spinner'
import { getProduk, createProduk, updateProduk } from '../services/produkService'
import { getKonsinyator } from '../services/konsinyatorService'
import { formatRupiah } from '../utils/formatters'

const PAGE_SIZE = 12

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function cls(...parts) {
  return parts.filter(Boolean).join(' ')
}

// ─────────────────────────────────────────────────────────────────────────────
// Stock badge
// ─────────────────────────────────────────────────────────────────────────────

function StokBadge({ sisa, awal }) {
  const ratio = awal > 0 ? sisa / awal : 0
  let style = 'bg-green-100 text-green-700'
  let label = 'Tersedia'
  if (sisa === 0)          { style = 'bg-red-100 text-red-700';       label = 'Habis'   }
  else if (ratio <= 0.25)  { style = 'bg-orange-100 text-orange-700'; label = 'Menipis' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Product card
// ─────────────────────────────────────────────────────────────────────────────

function ProdukCard({ produk, onEdit }) {
  const { nama, harga, stok_sisa, stok_awal, terjual } = produk
  const pct = stok_awal > 0 ? Math.round((stok_sisa / stok_awal) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800 leading-snug line-clamp-2">{nama}</h3>
        <StokBadge sisa={stok_sisa} awal={stok_awal} />
      </div>

      <p className="text-xl font-bold text-[#4CAF50]">{formatRupiah(harga)}</p>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Stok sisa</span>
          <span>{stok_sisa} / {stok_awal}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4CAF50] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <p className="text-xs text-gray-400">
          Terjual: <span className="font-medium text-gray-600">{terjual}</span>
        </p>
        <button
          onClick={() => onEdit(produk)}
          className="text-xs text-[#4CAF50] hover:underline font-medium"
          aria-label={`Edit produk ${nama}`}
        >
          Edit
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton card
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded-full w-14" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/2" />
      <div className="space-y-1">
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-24 mt-auto" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────

function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginasi produk">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman sebelumnya"
      >‹</button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cls(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            p === page ? 'bg-[#4CAF50] text-white' : 'text-gray-600 hover:bg-gray-100'
          )}
        >{p}</button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman berikutnya"
      >›</button>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ProdukModal — Create & Update
//
// Create payload  POST /api/produk  → { konsinyator_id, nama, harga, stok }
// Update payload  PUT  /api/produk/:id → { nama, harga, stok_sisa, stok_awal }
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM = { konsinyator_id: '', nama: '', harga: '', stok: '', stok_sisa: '', stok_awal: '' }

function ProdukModal({ open, produk, onClose, onSaved }) {
  const isEdit = Boolean(produk)
  const dialogRef = useRef(null)

  const [form, setForm]           = useState(EMPTY_FORM)
  const [konsinyators, setKons]   = useState([])
  const [loadingKons, setLoadKons]= useState(false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState(null)

  // Seed form when modal opens / produk changes
  useEffect(() => {
    if (!open) return
    setError(null)
    setSaving(false)

    if (isEdit) {
      setForm({
        konsinyator_id: produk.konsinyator_id ?? '',
        nama:           produk.nama            ?? '',
        harga:          String(produk.harga    ?? ''),
        stok:           '',                            // not used for edit
        stok_sisa:      String(produk.stok_sisa ?? ''),
        stok_awal:      String(produk.stok_awal ?? ''),
      })
    } else {
      setForm(EMPTY_FORM)
      // Fetch konsinyator list for the create form
      setLoadKons(true)
      getKonsinyator()
        .then(setKons)
        .catch(() => {})
        .finally(() => setLoadKons(false))
    }
  }, [open, produk, isEdit])

  // Trap focus / close on Escape
  useEffect(() => {
    if (!open) return
    const el = dialogRef.current
    if (el) el.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (isEdit) {
        // PUT /api/produk/:id — { nama, harga, stok_sisa, stok_awal }
        await updateProduk(produk.id, {
          nama:      form.nama.trim(),
          harga:     Number(form.harga),
          stok_sisa: Number(form.stok_sisa),
          stok_awal: Number(form.stok_awal),
        })
      } else {
        // POST /api/produk — { konsinyator_id, nama, harga, stok }
        await createProduk({
          konsinyator_id: form.konsinyator_id,
          nama:           form.nama.trim(),
          harga:          Number(form.harga),
          stok:           Number(form.stok),
        })
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="presentation"
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="produk-modal-title"
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 id="produk-modal-title" className="text-lg font-semibold text-gray-800">
            {isEdit ? 'Edit Produk' : 'Tambah Produk'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-4">

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            {/* Konsinyator — create only */}
            {!isEdit && (
              <div className="space-y-1">
                <label htmlFor="pm-konsinyator" className="block text-sm font-medium text-gray-700">
                  Konsinyator <span className="text-red-500">*</span>
                </label>
                {loadingKons ? (
                  <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
                    <Spinner className="w-4 h-4" /> Memuat…
                  </div>
                ) : (
                  <select
                    id="pm-konsinyator"
                    value={form.konsinyator_id}
                    onChange={set('konsinyator_id')}
                    required
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] transition"
                  >
                    <option value="" disabled>Pilih konsinyator…</option>
                    {konsinyators.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Nama */}
            <div className="space-y-1">
              <label htmlFor="pm-nama" className="block text-sm font-medium text-gray-700">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                id="pm-nama"
                type="text"
                value={form.nama}
                onChange={set('nama')}
                required
                placeholder="e.g. Nasi Uduk Komplit"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] transition"
              />
            </div>

            {/* Harga */}
            <div className="space-y-1">
              <label htmlFor="pm-harga" className="block text-sm font-medium text-gray-700">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                id="pm-harga"
                type="number"
                min={0}
                value={form.harga}
                onChange={set('harga')}
                required
                placeholder="15000"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] transition"
              />
            </div>

            {/* Stok — create */}
            {!isEdit && (
              <div className="space-y-1">
                <label htmlFor="pm-stok" className="block text-sm font-medium text-gray-700">
                  Stok Awal <span className="text-red-500">*</span>
                </label>
                <input
                  id="pm-stok"
                  type="number"
                  min={1}
                  value={form.stok}
                  onChange={set('stok')}
                  required
                  placeholder="50"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] transition"
                />
              </div>
            )}

            {/* Stok Awal & Stok Sisa — edit only */}
            {isEdit && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="pm-stok-awal" className="block text-sm font-medium text-gray-700">
                    Stok Awal <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pm-stok-awal"
                    type="number"
                    min={0}
                    value={form.stok_awal}
                    onChange={set('stok_awal')}
                    required
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] transition"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="pm-stok-sisa" className="block text-sm font-medium text-gray-700">
                    Stok Sisa <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pm-stok-sisa"
                    type="number"
                    min={0}
                    value={form.stok_sisa}
                    onChange={set('stok_sisa')}
                    required
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 pb-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#43A047] disabled:opacity-60 transition-colors"
            >
              {saving && <Spinner className="w-4 h-4" />}
              {isEdit ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

const Produk = () => {
  const [produkList, setProdukList] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)

  // Modal state
  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState(null) // null = create, object = edit

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    getProduk()
      .then(setProdukList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search])

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit   = (p) => { setEditTarget(p);   setModalOpen(true) }
  const closeModal = () => setModalOpen(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return produkList
    return produkList.filter((p) => p.nama.toLowerCase().includes(q))
  }, [produkList, search])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produk</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-500 mt-0.5">
              {filtered.length} produk{search ? ' ditemukan' : ' terdaftar'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="search"
              placeholder="Cari nama produk…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] transition"
              aria-label="Cari produk"
            />
          </div>

          {/* Add button */}
          <button
            onClick={openCreate}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#43A047] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tambah
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600" role="alert">
          Gagal memuat produk: {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <svg
            className="w-14 h-14 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
          <p className="text-gray-500 font-medium">
            {search ? `Produk "${search}" tidak ditemukan` : 'Belum ada produk'}
          </p>
          {search ? (
            <button onClick={() => setSearch('')} className="text-sm text-[#4CAF50] hover:underline">
              Hapus pencarian
            </button>
          ) : (
            <button onClick={openCreate} className="text-sm text-[#4CAF50] hover:underline">
              Tambah produk pertama
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && paginated.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((p) => (
              <ProdukCard key={p.id} produk={p} onEdit={openEdit} />
            ))}
          </div>
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}

      {/* Modal */}
      <ProdukModal
        open={modalOpen}
        produk={editTarget}
        onClose={closeModal}
        onSaved={load}
      />
    </div>
  )
}

export default Produk
