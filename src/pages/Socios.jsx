import React, { useEffect, useState } from 'react'
import { db, storage } from '../firebase'
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Socios({ user, role }) {
  const [list, setList] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null) // 👈 nuevo: socio seleccionado para ver detalle
  const [form, setForm] = useState({
    numeroSocio: '',
    nombre: '',
    apellidos: '',
    dni: '',
    telefono: '',
    fechaInscripcion: '',
    avalador: '',
    saldo: 0,
    foto: null
  })

  useEffect(() => { fetchList() }, [])

  const fetchList = async () => {
    const snap = await getDocs(collection(db, 'socios'))
    setList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const getNextSocioNumber = async () => {
    const snap = await getDocs(collection(db, 'socios'))
    const numbers = snap.docs.map(d => d.data().numeroSocio).filter(n => n != null)
    const max = numbers.length > 0 ? Math.max(...numbers) : 0
    return max + 1
  }

  const save = async () => {
    if (role !== 'admin') { alert('Acceso denegado'); return }

    let numeroSocio = form.numeroSocio
    if (!numeroSocio) numeroSocio = await getNextSocioNumber()

    let fotoURL = ''
    if (form.foto) {
      const fotoRef = ref(storage, `socios/${numeroSocio}_${form.foto.name}`)
      await uploadBytes(fotoRef, form.foto)
      fotoURL = await getDownloadURL(fotoRef)
    }

    await addDoc(collection(db, 'socios'), {
      numeroSocio,
      nombre: form.nombre,
      apellidos: form.apellidos,
      dni: form.dni,
      telefono: form.telefono,
      fechaInscripcion: form.fechaInscripcion,
      avalador: form.avalador,
      saldo: parseFloat(form.saldo) || 0,
      fotoURL
    })

    setShowForm(false)
    setForm({ numeroSocio: '', nombre: '', apellidos: '', dni: '', telefono: '', fechaInscripcion: '', avalador: '', saldo: 0, foto: null })
    fetchList()
  }

  const remove = async (s) => {
    if (role !== 'admin') { alert('Acceso denegado'); return }
    await deleteDoc(doc(db, 'socios', s.id))
    fetchList()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3>Socios</h3>
        {role === 'admin' && <button className="btn green" onClick={() => setShowForm(true)}>Nuevo socio</button>}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nº Socio</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Tel</th>
              <th>Renovación</th>
              <th>Saldo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id}>
                <td>
                  {s.fotoURL ? (
                    <img src={s.fotoURL} alt="" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : '—'}
                </td>
                <td>{s.numeroSocio}</td>
                <td>{s.nombre} {s.apellidos}</td>
                <td>{s.dni}</td>
                <td>{s.telefono}</td>
                <td>{s.fechaInscripcion}</td>
                <td>{s.saldo}</td>
                <td style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn ghost" onClick={() => setSelected(s)}>Ver detalle</button>
                  {role === 'admin' && <button className="btn red" onClick={() => remove(s)}>Eliminar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORMULARIO NUEVO SOCIO */}
      {showForm && (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 400, maxHeight: '90vh', overflowY: 'auto' }}>
            <h4>Nuevo socio</h4>
            <input placeholder="Número de socio (vacío = automático)" value={form.numeroSocio}
              onChange={e => setForm({ ...form, numeroSocio: e.target.value })} /><br />
            <input placeholder="Nombre" value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })} /><br />
            <input placeholder="Apellidos" value={form.apellidos}
              onChange={e => setForm({ ...form, apellidos: e.target.value })} /><br />
            <input placeholder="DNI" value={form.dni}
              onChange={e => setForm({ ...form, dni: e.target.value })} /><br />
            <input placeholder="Teléfono" value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })} /><br />
            <input placeholder="Fecha inscripción (YYYY-MM-DD)" value={form.fechaInscripcion}
              onChange={e => setForm({ ...form, fechaInscripcion: e.target.value })} /><br />
            <input placeholder="Avalador" value={form.avalador}
              onChange={e => setForm({ ...form, avalador: e.target.value })} /><br />
            <input placeholder="Saldo" value={form.saldo}
              onChange={e => setForm({ ...form, saldo: e.target.value })} /><br />
            <input type="file" accept="image/*"
              onChange={e => setForm({ ...form, foto: e.target.files[0] })} /><br />
            <div style={{ marginTop: 8 }}>
              <button className="btn green" onClick={save}>Guardar</button>
              <button className="btn ghost" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE SOCIO */}
      {selected && (
        <div style={{
          position: 'fixed', left: 0, top: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: 420, padding: 20, textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setSelected(null)} style={{
              position: 'absolute', right: 10, top: 10, border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer'
            }}>✖</button>
            <img src={selected.fotoURL || '/no-photo.png'} alt=""
              style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />
            <h3>{selected.nombre} {selected.apellidos}</h3>
            <p><b>Nº Socio:</b> {selected.numeroSocio}</p>
            <p><b>DNI:</b> {selected.dni}</p>
            <p><b>Teléfono:</b> {selected.telefono}</p>
            <p><b>Fecha Inscripción:</b> {selected.fechaInscripcion}</p>
            <p><b>Avalador:</b> {selected.avalador}</p>
            <p><b>Saldo:</b> {selected.saldo} €</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn ghost" onClick={() => setSelected(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
