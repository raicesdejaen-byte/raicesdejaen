import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'

export default function Monedero({ user, role }) {
  const [socios, setSocios] = useState([])
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchSocios() }, [])

  const fetchSocios = async () => {
    const snap = await getDocs(collection(db, 'socios'))
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    data.sort((a, b) => (a.numeroSocio || 0) - (b.numeroSocio || 0))
    setSocios(data)
  }

  const editSaldo = async () => {
    if (role !== 'admin') { alert('Acceso denegado'); return }
    if (!amount) return
    const ref = doc(db, 'socios', selected.id)
    await updateDoc(ref, { saldo: (Number(selected.saldo) || 0) + Number(amount) })
    setSelected(null)
    setAmount('')
    fetchSocios()
  }

  const filtered = socios.filter(s =>
    s.numeroSocio?.toString().toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
        <h3>Monedero</h3>
        <input
          placeholder="Buscar por Nº de socio..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', width: 200 }}
        />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nº Socio</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Saldo (€)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  {s.fotoURL
                    ? <img src={s.fotoURL} alt="" style={{ width: 45, height: 45, borderRadius: '50%', objectFit: 'cover' }} />
                    : <img src="/default-photo.png" alt="" style={{ width: 45, height: 45, borderRadius: '50%', opacity: 0.6 }} />}
                </td>
                <td>{s.numeroSocio}</td>
                <td>{s.nombre} {s.apellidos}</td>
                <td>{s.dni}</td>
                <td>{s.saldo || 0}</td>
                <td>
                  {role === 'admin' &&
                    <button className="btn" onClick={() => setSelected(s)}>Editar créditos</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL PARA EDITAR SALDO */}
      {selected && (
        <>
          <div className="modal-overlay" onClick={() => setSelected(null)}></div>
          <div className="modal">
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute', right: 10, top: 10,
                border: 'none', background: 'transparent',
                fontSize: 18, cursor: 'pointer'
              }}
            >✖</button>
            <h4>Editar saldo</h4>
            <p><b>{selected.nombre}</b></p>
            <p>Saldo actual: {selected.saldo || 0} €</p>
            <input
              type="number"
              placeholder="Cantidad (+ o -)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && editSaldo()}
              style={{ marginTop: 8, padding: 6, width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
            />
            <div style={{ marginTop: 12 }}>
              <button className="btn green" onClick={editSaldo}>Guardar</button>
              <button className="btn ghost" onClick={() => setSelected(null)}>Cancelar</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
