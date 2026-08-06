import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Produk from './pages/Produk'
import Konsinyator from './pages/Konsinyator'
import Transaksi from './pages/Transaksi'
import Pesanan from './pages/Pesanan'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Toast from './components/ui/Toast'

function App() {
  return (
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <ToastProvider>
          <Toast />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="produk" element={<Produk />} />
              <Route path="konsinyator" element={<Konsinyator />} />
              <Route path="transaksi" element={<Transaksi />} />
              <Route path="pesanan" element={<Pesanan />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
