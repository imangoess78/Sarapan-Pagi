import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ReceiptText,
  ClipboardList,
  X,
  UtensilsCrossed,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/produk', label: 'Produk', icon: ShoppingBag },
  { to: '/konsinyator', label: 'Konsinyator', icon: Users },
  { to: '/transaksi', label: 'Transaksi', icon: ReceiptText },
  { to: '/pesanan', label: 'Pesanan', icon: ClipboardList },
]

const MobileNav = ({ open, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="lg:hidden fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav className="relative z-10 w-72 bg-zinc-900 text-white flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#4CAF50] grid place-items-center shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-[13px] tracking-tight uppercase text-white">
                Lapak Jajan
              </p>
              <p className="text-[10px] text-zinc-400">Sarapan Pagi Bintaro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-[#4CAF50] text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom info */}
        <div className="px-4 pb-6 pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800">
            <span className="inline-flex w-2 h-2 rounded-full bg-[#6BBF6B] animate-pulse" />
            <span className="text-[11px] text-zinc-400 font-medium">Buka 05.30–10.00 WIB</span>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default MobileNav
