import React, {useState, useEffect} from 'react'
import { db } from '../firebase'
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore'

export default function Inventario({user, role}){
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  useEffect(()=>{ fetchItems() },[])

  const fetchItems = async ()=>{
    const snap = await getDocs(collection(db,'inventario'))
    setItems(snap.docs.map(d=> ({id:d.id, ...d.data()})))
  }

  const addItem = async ()=>{
    if(role!=='admin'){ alert('Acceso denegado'); return }
    await addDoc(collection(db,'inventario'), {name, qty:1, price: Number(price||0)})
    setName(''); setPrice(''); fetchItems()
  }

  const changeQty = async (it, delta)=>{
    if(role!=='admin'){ alert('Acceso denegado'); return }
    const ref = doc(db,'inventario', it.id)
    await updateDoc(ref, { qty: (it.qty||0) + delta })
    fetchItems()
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
        <h3>Inventario</h3>
        {role==='admin' && (
          <div style={{display:'flex',gap:8}}>
            <input placeholder="Producto" value={name} onChange={e=>setName(e.target.value)} />
            <input placeholder="Precio" value={price} onChange={e=>setPrice(e.target.value)} />
            <button className="btn green" onClick={addItem}>Añadir</button>
          </div>
        )}
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th></th></tr></thead>
          <tbody>
            {items.map(it=> (
              <tr key={it.id}><td>{it.name}</td><td>{it.qty}</td><td>{it.price}</td><td style={{display:'flex',gap:6}}>{role==='admin' && <><button className="btn" onClick={()=>changeQty(it,1)}>+</button><button className="btn" onClick={()=>changeQty(it,-1)}>-</button></>}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
