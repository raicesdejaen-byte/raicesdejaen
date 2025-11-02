import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ user, role, logout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    setOpen(false); // cierra el menú en móvil al navegar
  };

  return (
    <>
      {/* 🔘 Botón hamburguesa visible solo en móvil */}
      <button
        className={`hamburger ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* 🧭 Menú lateral */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <img src="/logo.png" alt="logo" className="logo" />

        <div className="menu">
          <button onClick={() => go('/')}>Inicio</button>
          <button onClick={() => go('/socios')}>Socios</button>
          <button onClick={() => go('/inventario')}>Inventario</button>
          <button onClick={() => go('/monedero')}>Monedero</button>
        </div>

        {user && (
          <div style={{ marginTop: 'auto' }}>
            <p className="small">{user.email}</p>
            <button className="btn ghost" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>

      {/* Fondo semitransparente para cerrar el menú al hacer clic fuera */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
}
