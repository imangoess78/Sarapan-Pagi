import { UtensilsCrossed } from 'lucide-react'

/**
 * Login page — placeholder.
 * The Worker has no /api/login endpoint, so authentication is not enforced yet.
 * This page is scaffolded and ready for implementation when auth is added.
 */
const Login = () => (
  <div className="min-h-screen bg-[#f0f9f0] flex items-center justify-center p-6">
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#4CAF50] grid place-items-center mx-auto mb-4">
        <UtensilsCrossed className="w-7 h-7 text-white" />
      </div>
      <h1 className="text-xl font-black text-zinc-800 mb-1">Lapak Jajan Admin</h1>
      <p className="text-sm text-zinc-400 mb-6">Sarapan Pagi Bintaro</p>
      <p className="text-sm text-zinc-400 bg-zinc-50 rounded-xl px-4 py-3 border border-zinc-100">
        Halaman login belum diimplementasikan.
      </p>
    </div>
  </div>
)

export default Login
