// src/components/Sidebar.jsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ user, role, logout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/socios', label: 'Socios' },
    { to: '/inventario', label: 'Inventario' },
    { to: '/monedero', label: 'Monedero' },
  ]

  const handleLinkClick = () => {
    // si estamos en móvil, cerramos el sidebar al pulsar enlace
    if (window.innerWidth <= 900) setOpen(false)
  }

  return (
    <>
      {/* Botón hamburguesa (visible en móvil) */}
      <button
        className={`hamburger ${open ? 'is-open' : ''}`}
        aria-label="Abrir menú"
        onClick={() => setOpen(s => !s)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-hidden={!open && window.innerWidth <= 900}>
        <img src="/raicesdejaen.jpg" alt="logo" className="logo" />

        <nav className="menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => { handleLinkClick(); }}>
              <button className={location.pathname === l.to ? 'active' : ''}>{l.label}</button>
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
          {user ? (
            <div className="small">
              <div style={{ fontWeight: 700 }}>{user.email} {role ? `(${role})` : ''}</div>
              <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => { setOpen(false); logout(); }}>Cerrar sesión</button>
            </div>
          ) : (
            <div className="small">No conectado</div>
          )}
        </div>
      </aside>

      {/* Overlay semitransparente en móvil cuando el menú está abierto */}
      <div className={`sidebar-overlay ${open ? 'visible' : ''}`} onClick={() => setOpen(false)} />
    </>
  )
}
