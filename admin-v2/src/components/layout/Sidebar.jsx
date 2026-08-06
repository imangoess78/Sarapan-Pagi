import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ReceiptText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/produk', label: 'Produk', icon: ShoppingBag },
  { to: '/konsinyator', label: 'Konsinyator', icon: Users },
  { to: '/transaksi', label: 'Transaksi', icon: ReceiptText },
  { to: '/pesanan', label: 'Pesanan', icon: ClipboardList },
]

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation()

  return (
    <aside
      className={`
        hidden lg:flex flex-col bg-zinc-900 text-white transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        min-h-screen shrink-0
      `}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-zinc-800">
        <div className="w-9 h-9 rounded-full bg-[#4CAF50] grid place-items-center shrink-0">
          <UtensilsCrossed className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-black text-[13px] tracking-tight uppercase leading-tight text-white truncate">
              Lapak Jajan
            </p>
            <p className="text-[10px] text-zinc-400 truncate">Sarapan Pagi Bintaro</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive
                ? 'bg-[#4CAF50] text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}
              `
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors text-sm"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
