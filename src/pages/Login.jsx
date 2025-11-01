import React, { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      await signInWithEmailAndPassword(auth, email, password)
    }catch(err){
      alert('Error de acceso: ' + (err.message || err.code))
    }finally{ setLoading(false) }
  }

  return (
    <div style={{maxWidth:420, margin:'20px auto'}}>
      <div style={{textAlign:'center'}}>
        <img src="/raicesdejaen.jpg" alt="logo" style={{width:160, borderRadius:12}} />
      </div>
      <div className="card" style={{marginTop:16}}>
        <h3>Iniciar sesión</h3>
        <form onSubmit={submit}>
          <div style={{marginBottom:8}}><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8}} /></div>
          <div style={{marginBottom:8}}><input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8}} /></div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn green" type="submit" disabled={loading}>Entrar</button>
          </div>
        </form>
        <div className="small" style={{marginTop:8}}>Usuario admin: admin@raicesdejaen.com</div>
      </div>
    </div>
  )
}
