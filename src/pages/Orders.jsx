import { useState } from 'react'
import { Modal, Confirm, Card, Badge, Btn, Field, Inp, Sel, Textarea, Icon, STATUSES, STATUS_COLOR, SOURCES, fmt, today } from '../components/ui'

export default function Orders({ orders, clients, catalog, db, toast }) {
  const [filter, setFilter] = useState('Все')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'Все' || o.status === filter
    const q = search.toLowerCase()
    const cl = clients.find(c => c.id === o.client_id)
    const matchSearch = !q || o.product?.toLowerCase().includes(q) || cl?.name?.toLowerCase().includes(q) || String(o.id).includes(q)
    return matchStatus && matchSearch
  })

  const blank = () => ({
    client_id: clients[0]?.id || '',
    product: catalog[0]?.name || '',
    custom_product: '',
    price: catalog[0]?.price || '',
    cost: catalog[0]?.cost || '',
    prepaid: '',
    status: 'Новый',
    source: 'Instagram',
    order_date: today(),
    note: '',
  })

  const openNew = () => { setForm(blank()); setModal('new') }
  const openEdit = (o) => {
    setForm({
      client_id: o.client_id, product: o.product, custom_product: o.custom_product || '',
      price: o.price, cost: o.cost, prepaid: o.prepaid,
      status: o.status, source: o.source, order_date: o.order_date, note: o.note || '',
    })
    setModal(o)
  }

  const onProductChange = (name) => {
    const cat = catalog.find(c => c.name === name)
    if (cat) setForm(f => ({ ...f, product: name, price: cat.price, cost: cat.cost, prepaid: Math.round(cat.price / 2) }))
    else setForm(f => ({ ...f, product: name }))
  }

  const saveOrder = async () => {
    setSaving(true)
    const row = {
      client_id: +form.client_id || null,
      product: form.product,
      custom_product: form.custom_product || null,
      price: +form.price || 0,
      cost: +form.cost || 0,
      prepaid: +form.prepaid || 0,
      status: form.status,
      source: form.source,
      order_date: form.order_date,
      note: form.note || null,
    }
    if (modal === 'new') {
      const { error } = await db.orders.insert(row)
      if (error) { toast('Ошибка сохранения', 'error'); setSaving(false); return }
      toast('Заказ добавлен ✓')
    } else {
      const { error } = await db.orders.update(modal.id, row)
      if (error) { toast('Ошибка обновления', 'error'); setSaving(false); return }
      toast('Заказ обновлён ✓')
    }
    setSaving(false)
    setModal(null)
  }

  const deleteOrder = async (id) => {
    await db.orders.remove(id)
    setConfirm(null)
    toast('Заказ удалён')
  }

  const advance = async (o) => {
    const i = STATUSES.indexOf(o.status)
    if (i < STATUSES.length - 1) {
      await db.orders.update(o.id, { status: STATUSES[i + 1] })
      toast(`→ ${STATUSES[i + 1]}`)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 800 }}>Заказы <span style={{ color: '#444', fontSize: 14 }}>{orders.length}</span></h2>
        <Btn onClick={openNew}><Icon n="plus" size={14} />Новый</Btn>
      </div>

      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Icon n="search" size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." style={{ width: '100%', background: '#15171c', border: '1px solid #1e2028', borderRadius: 10, padding: '10px 12px 10px 36px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {['Все', ...STATUSES].map(s => {
          const cnt = s === 'Все' ? orders.length : orders.filter(o => o.status === s).length
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? (STATUS_COLOR[s] || '#c9a96e') : '#15171c',
              color: filter === s ? '#fff' : '#555',
              border: `1px solid ${filter === s ? (STATUS_COLOR[s] || '#c9a96e') : '#1e2028'}`,
              borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap',
            }}>{s} {cnt}</button>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(o => {
          const cl = clients.find(c => c.id === o.client_id)
          const profit = (+o.price || 0) - (+o.cost || 0)
          const rem = (+o.price || 0) - (+o.prepaid || 0)
          const nextStatus = STATUSES[STATUSES.indexOf(o.status) + 1]
          return (
            <Card key={o.id} accent={STATUS_COLOR[o.status]}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#444' }}>#{o.id}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{o.product}</span>
                    <Badge status={o.status} />
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>👤 {cl?.name || '—'}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>📞 {cl?.phone || '—'} · {o.source}</div>
                  {o.note ? <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>💬 {o.note}</div> : null}
                  <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>📅 {o.order_date}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#c9a96e' }}>{fmt(o.price)}</div>
                  <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>+{fmt(profit)}</div>
                  <div style={{ fontSize: 11, color: rem > 0 ? '#f59e0b' : '#444', marginTop: 1 }}>ост. {fmt(rem)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 12, flexWrap: 'wrap' }}>
                {nextStatus && <Btn sm onClick={() => advance(o)}>→ {nextStatus}</Btn>}
                <Btn sm onClick={() => openEdit(o)} style={{ background: '#1e2028', color: '#999' }}><Icon n="edit" size={13} /></Btn>
                <Btn sm variant="red" onClick={() => setConfirm(o.id)}><Icon n="trash" size={13} /></Btn>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#444', padding: 40, fontSize: 14 }}>Нет заказов</div>}
      </div>

      {confirm && <Confirm msg="Удалить заказ?" onYes={() => deleteOrder(confirm)} onNo={() => setConfirm(null)} />}

      {modal && (
        <Modal title={modal === 'new' ? '➕ Новый заказ' : `✏️ Заказ #${modal.id}`} onClose={() => setModal(null)}>
          <Field label="Клиент">
            <Sel value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}>
              <option value="">— выбрать клиента —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Sel>
          </Field>
          <Field label="Товар">
            <Sel value={form.product} onChange={e => onProductChange(e.target.value)}>
              {catalog.map(c => <option key={c.id}>{c.name}</option>)}
              <option value="Индивидуальный">Индивидуальный заказ</option>
            </Sel>
          </Field>
          {form.product === 'Индивидуальный' && (
            <Field label="Описание">
              <Inp value={form.custom_product} onChange={e => setForm(f => ({ ...f, custom_product: e.target.value }))} placeholder="Опишите изделие..." />
            </Field>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Цена (сом)"><Inp type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></Field>
            <Field label="Себестоимость"><Inp type="number" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} /></Field>
            <Field label="Предоплата"><Inp type="number" value={form.prepaid} onChange={e => setForm(f => ({ ...f, prepaid: e.target.value }))} /></Field>
            <Field label="Остаток"><Inp readOnly value={Math.max(0, (+form.price || 0) - (+form.prepaid || 0))} style={{ color: '#555' }} /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Статус">
              <Sel value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </Sel>
            </Field>
            <Field label="Источник">
              <Sel value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </Sel>
            </Field>
          </div>
          <Field label="Дата"><Inp type="date" value={form.order_date} onChange={e => setForm(f => ({ ...f, order_date: e.target.value }))} /></Field>
          <Field label="Примечание"><Textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Цвет, размер, детали..." /></Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Btn onClick={saveOrder} disabled={saving} style={{ flex: 1 }}><Icon n="save" size={14} />{saving ? 'Сохранение...' : 'Сохранить'}</Btn>
            <Btn variant="ghost" onClick={() => setModal(null)} style={{ background: '#1e2028', color: '#999' }}>Отмена</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}
