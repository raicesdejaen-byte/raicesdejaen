import React, {useState, useEffect} from 'react'
import { db } from '../firebase'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'

export default function Monedero({user, role}){
  const [socios, setSocios] = useState([])
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')

  useEffect(()=>{ fetchSocios() },[])

  const fetchSocios = async ()=>{
    const snap = await getDocs(collection(db,'socios'))
    setSocios(snap.docs.map(d=> ({id:d.id, ...d.data()})))
  }

  const editSaldo = async ()=>{
    if(role!=='admin'){ alert('Acceso denegado'); return }
    const ref = doc(db,'socios', selected.id)
    await updateDoc(ref, { saldo: Number((selected.saldo||0) + Number(amount||0)) })
    setSelected(null); setAmount(''); fetchSocios()
  }

  return (
    <div>
      <h3>Monedero</h3>
      <div className="card">
        <table className="table">
          <thead><tr><th>Nombre</th><th>DNI</th><th>Saldo</th><th></th></tr></thead>
          <tbody>
            {socios.map(s=> <tr key={s.id}><td>{s.nombre} {s.apellidos}</td><td>{s.dni}</td><td>{s.saldo||0}</td><td>{role==='admin' && <button className="btn" onClick={()=>setSelected(s)}>Editar créditos</button>}</td></tr>)}
          </tbody>
        </table>

        {selected && (
          <div style={{marginTop:12}} className="card">
            <h4>Editar — {selected.nombre}</h4>
            <input placeholder="Cantidad" value={amount} onChange={e=>setAmount(e.target.value)} />
            <div style={{marginTop:8}}><button className="btn green" onClick={editSaldo}>Guardar</button> <button className="btn ghost" onClick={()=>setSelected(null)}>Cancelar</button></div>
          </div>
        )}
      </div>
    </div>
  )
}
