// ─── CATALOG ────────
import { useState } from 'react'
import { Modal, Confirm, Card, Btn, Field, Inp, Icon, EXP_CATS, fmt, today } from '../components/ui'

export function Catalog({ catalog, orders, db, toast }) {
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const openNew = () => { setForm({ name: '', price: '', cost: '', emoji: '🪑', description: '' }); setModal('new') }
  const openEdit = (c) => { setForm({ name: c.name, price: c.price, cost: c.cost, emoji: c.emoji || '🪑', description: c.description || '' }); setModal(c) }

  const save = async () => {
    setSaving(true)
    const row = { name: form.name, price: +form.price || 0, cost: +form.cost || 0, emoji: form.emoji, description: form.description || null }
    if (modal === 'new') { await db.catalog.insert(row); } else { await db.catalog.update(modal.id, row); }
    setSaving(false); setModal(null)
  }
  const del = async (id) => { await db.catalog.remove(id); setConfirm(null); }

  return (<div><div style={{display='flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><h2 style={{margin:0,fontSize:20,color:'#fff',fontWeight:800}}>Каталог</h2><Btn onClick={openNew}><Icon n="plus" size={14} />Добавить</Btn></div><confirm && <Confirm msg="Удалить позицию?" onYes={()=>del(confirm)} onNo={()=>setConfirm(null)} />}</div>)
}

// FINANCE
export function Finance({ orders, expenses, db, toast }) {
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const revenue = orders.reduce((s,o)=>s+(+o.price||0),0)
  const profit = revenue - orders.reduce((s,o)=>s+(+o.cost||0),0) - expenses.reduce((s,e)=>s+(+e.amount||0),0)
  const collected = orders.reduce((s,o)=>s+(+o.prepaid||0),0)
  return (<div><h2 style={{margin:'0 0 14px',fontSize:20,color:'#fff',fontWeight:800}}>Финансл</h2><p style={{color:'#c9a96e'}}>Выручка: {revenue}</p><p style={{color:profit>=0?'#10b981':'#ef4444'}}>Прибыль: {profit}</p><p style={{color:'#3b82f6'}}>Получено:  {collected}</p></div>)
}

// ANALYTICS
import { SOURCESSTATUS_COLOR, STATUSES } from '../components/ui'

export function Analytics({ orders, clients, catalog }) {
  const completed = orders.filter(o => o.status === 'Завершён').length
  return (<div><h2 style={{margin:'0 0 14px',fontSize:20,color:'#fff',fontWeight:800}}>Аналитика</h2><p>Заказов: {orders.length}</p><p>Ленны: {clients.length}</p><p>Завершено: {completed}</p></div>)
}
