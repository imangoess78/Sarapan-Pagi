import { useLocation } from 'react-router-dom'
import { Menu, Bell, Store } from 'lucide-react'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/produk': 'Produk',
  '/konsinyator': 'Konsinyator',
  '/transaksi': 'Transaksi',
  '/pesanan': 'Pesanan',
}

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'Admin'

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4 px-4 md:px-6 h-14">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="flex-1">
          <h1 className="font-bold text-[15px] text-zinc-800">{title}</h1>
          <p className="text-[11px] text-zinc-400 hidden md:block">
            Lapak Jajan Sarapan Pagi Bintaro
          </p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Store status badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f9f0] border border-[#c8e6c9] text-[11px] font-semibold text-[#2e7d32]">
            <Store className="w-3.5 h-3.5" />
            <span>Buka 05.30–10.00</span>
          </div>

          {/* Notifications placeholder */}
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 relative"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#4CAF50] grid place-items-center text-white font-bold text-sm shrink-0">
            A
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
