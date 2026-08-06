import { useContext } from 'react'
import { ToastContext } from '../../contexts/ToastContext'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
  error:   <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />,
  info:    <Info className="w-5 h-5 text-blue-500 shrink-0" />,
}

const BG = {
  success: 'bg-white border-green-200',
  error:   'bg-white border-red-200',
  warning: 'bg-white border-yellow-200',
  info:    'bg-white border-blue-200',
}

const Toast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx || ctx.toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-label="Notifikasi"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
    >
      {ctx.toasts.map(({ id, message, type = 'info' }) => (
        <div
          key={id}
          role="alert"
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
            text-sm text-zinc-800 ${BG[type] ?? BG.info}
            animate-slide-in`}
        >
          {ICONS[type] ?? ICONS.info}
          <span className="flex-1 leading-snug">{message}</span>
          <button
            onClick={() => ctx.hideToast(id)}
            className="text-zinc-400 hover:text-zinc-700 mt-0.5 shrink-0"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
