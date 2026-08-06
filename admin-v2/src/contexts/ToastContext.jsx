import { createContext, useState, useCallback, useRef } from 'react'

export const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const timerRef = useRef({})

  const hideToast = useCallback((id) => {
    clearTimeout(timerRef.current[id])
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, message, type }])
      timerRef.current[id] = setTimeout(() => hideToast(id), duration)
      return id
    },
    [hideToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  )
}
