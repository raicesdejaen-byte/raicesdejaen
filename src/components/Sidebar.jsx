import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({user, role, logout}){
  return (
    <div className="sidebar">
      <img src="/raicesdejaen.jpg" alt="logo" className="logo" />
      <div className="menu">
        <Link to="/"><button>Inicio</button></Link>
        <Link to="/socios"><button>Socios</button></Link>
        <Link to="/inventario"><button>Inventario</button></Link>
        <Link to="/monedero"><button>Monedero</button></Link>
      </div>
      <div style={{marginTop:'auto', width:'100%', textAlign:'center'}}>
        {user? (
          <div className="small">
            <div style={{fontWeight:700}}>{user.email} {role? `(${role})`:''}</div>
            <button className="btn ghost" style={{marginTop:8}} onClick={logout}>Cerrar sesión</button>
          </div>
        ): (
          <div className="small">No conectado</div>
        )}
      </div>
    </div>
  )
}
