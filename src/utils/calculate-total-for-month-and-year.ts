import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'node:crypto'

interface Records {
  id: string
  year: number
  month: number
  total: Decimal
}

interface MonthlyTotal {
  id: string
  year: number
  month: number
  total: number
}

export function calculateMonthlyTotals(records: Records[]) {
  const monthlyTotals: Record<string, MonthlyTotal> = {}

  for (const record of records) {
    const key = `${record.year}-${record.month}`

    if (!monthlyTotals[key]) {
      monthlyTotals[key] = {
        id: randomUUID(),
        year: record.year,
        month: record.month,
        total: 0,
      }
    }

    monthlyTotals[key].total += Number(record.total)
  }

  return Object.values(monthlyTotals)
}
