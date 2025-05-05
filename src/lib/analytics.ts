import { MonthlySnapshot } from '@/types/database'
import { supabase } from './supabase'

export async function initializeMonthlySnapshot(userId: string): Promise<MonthlySnapshot> {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data: existing } = await supabase
    .from('monthly_snapshots')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)
    .maybeSingle()

  if (existing) return existing

  const { data, error } = await supabase
    .from('monthly_snapshots')
    .insert({
      user_id: userId,
      month,
      year,
      needs_balance: 0,
      wants_balance: 0,
      savings_balance: 0,
      total_expenses: 0,
      total_income: 0
    })
    .select()
    .single()

  if (error) throw error
  return data
}
