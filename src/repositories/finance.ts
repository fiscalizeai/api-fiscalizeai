import { Finance, Prisma } from '@prisma/client'

interface FetchReturnData {
  id: string
  iptu: number
  iss: number
  itbi: number
  month: number
  year: number
  created_at: Date
  totalTransfers: {
    id: string
    value: string
  }
}

export interface FinancesRepository {
  register(data: Prisma.FinanceUncheckedCreateInput): Promise<Finance>
  findByMonthAndYear(
    month: number | Prisma.IntFieldUpdateOperationsInput,
    year: number | Prisma.IntFieldUpdateOperationsInput,
  ): Promise<Finance | null>
  fetch(
    page: number,
    cityId: string,
    items?: number,
    month?: number,
    year?: number,
  ): Promise<{
    finances: FetchReturnData[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  }>
  edit(
    financeId: string,
    data: Prisma.FinanceUncheckedUpdateInput,
  ): Promise<Finance | null>
  findById(id: string): Promise<Finance | null>
  delete(id: string): Promise<void>
}
