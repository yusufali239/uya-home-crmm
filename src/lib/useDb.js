import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

function useTable(table, orderCol = 'id') {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderCol, { ascending: false })
    if (!error) setRows(data || [])
    setLoading(false)
  }, [table, orderCol])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, fetch)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [table, fetch])

  const insert = async (row) => {
    const { data, error } = await supabase.from(table).insert(row).select().single()
    if (!error) setRows(prev => [data, ...prev])
    return { data, error }
  }

  const update = async (id, row) => {
    const { data, error } = await supabase.from(table).update(row).eq('id', id).select().single()
    if (!error) setRows(prev => prev.map(r => r.id === id ? data : r))
    return { data, error }
  }

  const remove = async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) setRows(prev => prev.filter(r => r.id !== id))
    return { error }
  }

  return { rows, loading, insert, update, remove, refresh: fetch }
}

export function useOrders() { return useTable('orders', 'created_at') }
export function useClients() { return useTable('clients', 'created_at') }
export function useCatalog() { return useTable('catalog', 'id') }
export function useExpenses() { return useTable('expenses', 'created_at') }
