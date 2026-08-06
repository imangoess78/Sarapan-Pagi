import { ShoppingBag, Users, ReceiptText, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import { getProduk } from '../services/produkService'
import { getKonsinyator } from '../services/konsinyatorService'
import { getTransaksi } from '../services/transaksiService'
import { getPesanan } from '../services/pesananService'
import { formatRupiah } from '../utils/formatters'
import Spinner from '../components/ui/Spinner'

// ── Stat card ──────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl grid place-items-center shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-black text-zinc-800 leading-tight mt-0.5">
        {value ?? <span className="text-zinc-300">—</span>}
      </p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  </div>
)

// ── Error banner ───────────────────────────────────────────────────────────────
const ErrorBanner = ({ message }) => (
  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
    <AlertCircle className="w-4 h-4 shrink-0" />
    <span>{message}</span>
  </div>
)

// ── Dashboard ──────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const produk      = useFetch(getProduk)
  const konsinyator = useFetch(getKonsinyator)
  const transaksi   = useFetch(() => getTransaksi())
  const pesanan     = useFetch(getPesanan)

  const isLoading = produk.loading || konsinyator.loading || transaksi.loading || pesanan.loading
  const errors    = [produk.error, konsinyator.error, transaksi.error, pesanan.error].filter(Boolean)

  // Derived metrics
  const totalProduk     = produk.data?.length ?? null
  const totalKonsinyator = konsinyator.data?.length ?? null
  const totalTransaksi  = transaksi.data?.length ?? null
  const totalPesanan    = pesanan.data?.length ?? null

  const totalPenjualan = transaksi.data
    ? transaksi.data.reduce((sum, t) => sum + (t.total || 0), 0)
    : null

  const pesananBaru = pesanan.data
    ? pesanan.data.filter((p) => p.status === 'baru').length
    : null

  const stokHabis = produk.data
    ? produk.data.filter((p) => p.stok_sisa === 0).length
    : null

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-black text-zinc-800">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Ringkasan data Lapak Jajan Bintaro</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Spinner className="w-4 h-4" />
          <span>Memuat data…</span>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((err, i) => (
            <ErrorBanner key={i} message={err} />
          ))}
        </div>
      )}

      {/* Stat cards */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Produk"
              value={totalProduk}
              icon={ShoppingBag}
              color="bg-[#4CAF50]"
              sub={stokHabis !== null ? `${stokHabis} stok habis` : undefined}
            />
            <StatCard
              label="Konsinyator"
              value={totalKonsinyator}
              icon={Users}
              color="bg-sky-500"
            />
            <StatCard
              label="Transaksi"
              value={totalTransaksi}
              icon={ReceiptText}
              color="bg-violet-500"
              sub={totalPenjualan !== null ? formatRupiah(totalPenjualan) : undefined}
            />
            <StatCard
              label="Pesanan"
              value={totalPesanan}
              icon={ClipboardList}
              color="bg-amber-500"
              sub={pesananBaru !== null ? `${pesananBaru} baru` : undefined}
            />
          </div>

          {/* Total penjualan highlight */}
          {totalPenjualan !== null && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 grid place-items-center shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
                  Total Penjualan
                </p>
                <p className="text-3xl font-black text-zinc-800 leading-tight mt-0.5">
                  {formatRupiah(totalPenjualan)}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
