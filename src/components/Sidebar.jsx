import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react' // ⬅️ Iconos del menú

export default function Sidebar({ user, role, logout }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const go = (path) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <>
      {/* 🔘 Botón Hamburguesa (solo visible en móvil) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🧭 Menú lateral */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col p-4 transform transition-transform duration-300 z-40
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none`}
      >
        <img src="/logo.png" alt="logo" className="w-32 mx-auto mb-6" />

        <div className="flex flex-col gap-3">
          <button className="text-left" onClick={() => go('/')}>Inicio</button>
          <button className="text-left" onClick={() => go('/socios')}>Socios</button>
          <button className="text-left" onClick={() => go('/inventario')}>Inventario</button>
          <button className="text-left" onClick={() => go('/monedero')}>Monedero</button>
        </div>

        {user && (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">{user.email}</p>
            <button
              className="mt-2 text-sm text-red-600 hover:underline"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
