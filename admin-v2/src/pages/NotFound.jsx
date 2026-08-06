import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

const NotFound = () => (
  <div className="min-h-screen bg-[#f0f9f0] flex items-center justify-center p-6">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 grid place-items-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-amber-500" />
      </div>
      <h1 className="text-4xl font-black text-zinc-800 mb-2">404</h1>
      <p className="text-zinc-500 mb-6">Halaman yang kamu cari tidak ditemukan.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4CAF50] text-white font-semibold text-sm hover:bg-[#43A047] transition-colors"
      >
        <Home className="w-4 h-4" />
        Kembali ke Dashboard
      </Link>
    </div>
  </div>
)

export default NotFound
