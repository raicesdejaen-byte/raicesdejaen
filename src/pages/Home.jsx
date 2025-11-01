import React from 'react'

export default function Home(){ 
  return (
    <div>
      <div className="card" style={{display:'flex', gap:16, alignItems:'center'}}>
        <img src="/raicesdejaen.jpg" alt="logo" style={{width:120,height:120}} />
        <div>
          <h3 style={{margin:'0 0 6px 0'}}>Asociación Raíces de Jaén</h3>
          <div className="small">Panel de gestión — Bienvenido. Usa el menú a la derecha para navegar.</div>
        </div>
      </div>
      <div style={{marginTop:14}} className="card">
        <h4 style={{marginTop:0}}>Notificaciones</h4>
        <div className="notice">Renovaciones próximas (1 mes antes) aparecerán aquí.</div>
      </div>
    </div>
  )
}
