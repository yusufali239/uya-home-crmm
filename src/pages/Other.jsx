import { useState } from 'react'
import { Card, Btn, Field, Inp, Icon, EXP_CATS, fmt, today } from '../components/ui'

export function Catalog({ catalog, orders, db, toast }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, color: '#fff', fontWeight: 800 }}>Каталог</h2>
      {catalog.map(c => (
        <Card key={c.id}>
          <div style={{ fontSize: 14, color: '#fff' }}>{c.emoji} {c.name} — {fmt(c.price)}</div>
        </Card>
      ))}
    </div>
  )
}

export function Finance({ orders, expenses, db, toast }) {
  const revenue = orders.reduce((s,o) => s + (+o.price||0), 0)
  const profit = revenue - orders.reduce((s,o) => s + (+o.cost||0), 0) - expenses.reduce((s,e) => s + (+e.amount||0), 0)
  const collected = orders.reduce((s,o) => s + (+o.prepaid||0), 0)
  return (
    <div>
      <h2 style={{ margin: '0 0 14px', fontSize: 20, color: '#fff', fontWeight: 800 }}>Финансы</h2>
      <Card><div style={{ color: '#c9a96e', fontSize: 18, fontWeight: 800 }}>Выручка: {fmt(revenue)}</div></Card>
      <Card><div style={{ color: profit >= 0 ? '#10b981' : '#ef4444', fontSize: 18, fontWeight: 800 }}>Прибыль: {fmt(profit)}</div></Card>
      <Card><div style={{ color: '#3b82f6', fontSize: 18, fontWeight: 800 }}>Получено: {fmt(collected)}</div></Card>
    </div>
  )
}

export function Analytics({ orders, clients, catalog }) {
  const completed = orders.filter(o => o.status === 'Завершён').length
  return (
    <div>
      <h2 style={{ margin: '0 0 14px', fontSize: 20, color: '#fff', fontWeight: 800 }}>Аналитика</h2>
      <Card><div style={{ color: '#fff' }}>Заказов: {orders.length}</div></Card>
      <Card><div style={{ color: '#fff' }}>Клиентов: {clients.length}</div></Card>
      <Card><div style={{ color: '#10b981' }}>Завершено: {completed}</div></Card>
    </div>
  )
}
