import { useState } from 'react'
import { Modal, Confirm, Card, Btn, Field, Inp, Sel, Icon, SOURCES, fmt, today } from '../components/ui'

const SRC_COLOR = { Instagram: '#e1306c', WhatsApp: '#25d366', Telegram: '#0088cc', Сайт: '#c9a96e', Другое: '#888' }

export default function Clients({ clients, orders, db, toast }) {
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    return !q || c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.city?.toLowerCase().includes(q)
  })

  const openNew = () => { setForm({ name: '', phone: '', source: 'Instagram', city: '' }); setModal('new') }
  const openEdit = (c) => { setForm({ name: c.name, phone: c.phone || '', source: c.source, city: c.city || '' }); setModal(c) }

  const saveClient = async () => {
    setSaving(true)
    const row = { name: form.name, phone: form.phone || null, source: form.source, city: form.city || null }
    if (modal === 'new') {
      const { error } = await db.clients.insert(row)
      if (!error) toast('Қлиент добавлен ✓')
      else toast('Ошибка', 'error')
    } else {
      const { error } = await db.clients.update(modal.id, row)
      if (!error) toast('Клиент обновлён ✓')
      else toast('Ошибка', 'error')
    }
    setSaving(false)
    setModal(null)
  }

  const deleteClient = async (id) => {
    await db.clients.remove(id)
    setConfirm(null)
    toast('Клиент удалён')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 800 }}>Клиенты <span style={{ color: '#444', fontSize: 14 }}>{clients.length}</span></h2>
        <Btn onClick={openNew}><Icon n="plus" size={14} />Добавить</Btn>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск клиентов..." style={{ width: '100%', background: '#15171c', border: '1px solid #1e2028', borderRadius: 10, padding: '10px 13px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(c => {
          const cOrders = orders.filter(o => o.client_id === c.id)
          const total = cOrders.reduce((s, o) => s + (+o.price || 0), 0)
          const active = cOrders.filter(o => o.status !== 'Завершён').length
          const color = SRC_COLOR[c.source] || '#888'
          return (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#666', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {c.phone && <span>📞 {c.phone}</span>}
                    {c.city && <span>📍 {c.city}</span>}
                  </div>
                  <div style={{ marginTop: 7 }}>
                    <span style={{ background: color + '20', color, border: `1px solid ${color}40`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{c.source}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 15, color: '#c9a96e', fontWeight: 700 }}>{fmt(total)}</div>
                  <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{cOrders.length} заказов</div>
                  {active > 0 && <div style={{ fontSize: 11, color: '#f59e0b' }}>{active} активных</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 12 }}>
                <Btn sm onClick={() => openEdit(c)} style={{ background: '#1e2028', color: '#999' }}><Icon n="edit" size={13} />Изменить</Btn>
                <Btn sm variant="red" onClick={() => setConfirm(c.id)}><Icon n="trash" size={13} /></Btn>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#444', padding: 40, fontSize: 14 }}>Нет клиентов</div>}
      </div>

      {confirm && <Confirm msg="Удалить клиента?" onYes={() => deleteClient(confirm)} onNo={() => setConfirm(null)} />}

      {modal && (
        <Modal title={modal === 'new' ? '➕ Новый клиент' : '✏️ Редактировать'} onClose={() => setModal(null)}>
          <Field label="Полное имя"><Inp value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Имя Фамилия" /></Field>
          <Field label="Телефон"><Inp value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+996 700 000 000" /></Field>
          <Field label="Город"><Inp value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Бишкек" /></Field>
          <Field label="Источник">
            <Sel value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </Sel>
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Btn onClick={saveClient} disabled={saving} style={{ flex: 1 }}><Icon n="save" size={14} />{saving ? 'Сохранение...' : 'Сохранить'}</Btn>
            <Btn variant="ghost" onClick={() => setModal(null)} style={{ background: '#1e2028', color: '#999' }}>Отмена</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}
