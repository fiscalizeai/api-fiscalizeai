import { Finance, Prisma, TotalTransfer } from '@prisma/client'

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
    finances: Finance[]
    totalTransfers: TotalTransfer[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  } | null>
  edit(
    financeId: string,
    data: Prisma.FinanceUncheckedUpdateInput,
  ): Promise<Finance | null>
  findById(id: string): Promise<Finance | null>
  delete(id: string): Promise<void>
}
