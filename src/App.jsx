import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { auth, ensureAdminExists } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Home from './pages/Home'
import Socios from './pages/Socios'
import Inventario from './pages/Inventario'
import Monedero from './pages/Monedero'

// ✅ Componente que protege rutas sin romper la navegación
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const navigate = useNavigate()

  // Crear admin si no existe
  useEffect(() => { ensureAdminExists() }, [])

  // Escuchar cambios de sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u)
        if (u.email === 'admin@raicesdejaen.com') setRole('admin')
        else setRole('user')
      } else {
        setUser(null)
        setRole(null)
      }
    })
    return () => unsub()
  }, [])

  const logout = async () => { await signOut(auth); navigate('/') }

  return (
    <div className="app">
      <Sidebar user={user} role={role} logout={logout} />
      <main className="main">
        <Routes>
          <Route path="/" element={user ? <Home user={user} role={role} /> : <Login />} />

          <Route 
            path="/socios" 
            element={
              <ProtectedRoute user={user}>
                <Socios user={user} role={role} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/inventario" 
            element={
              <ProtectedRoute user={user}>
                <Inventario user={user} role={role} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/monedero" 
            element={
              <ProtectedRoute user={user}>
                <Monedero user={user} role={role} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}
