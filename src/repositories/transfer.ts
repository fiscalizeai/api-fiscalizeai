import { TransferFilters } from '@/utils/filters-type'
import { Transfer } from '@prisma/client'

export interface TransferRepository {
  findById(id: string): Promise<Transfer | null>

  fetch(
    page: number,
    cityId: string,
    items?: number,
    filters?: TransferFilters,
  ): Promise<{
    transfers: Transfer[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  } | null>
}
