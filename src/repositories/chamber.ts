import { Prisma, Chamber } from '@prisma/client'

export interface ChamberRecordsRepository {
  register(data: Prisma.ChamberUncheckedCreateInput): Promise<Chamber>
  findByMonthAndYear(
    month: number | Prisma.IntFieldUpdateOperationsInput,
    year: number | Prisma.IntFieldUpdateOperationsInput,
  ): Promise<Chamber | null>
  fetch(
    page: number,
    cityId: string,
    items?: number,
    month?: number,
    year?: number,
  ): Promise<{
    chamber: Chamber[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  } | null>
  edit(
    chamberId: string,
    data: Prisma.ChamberUncheckedUpdateInput,
  ): Promise<Chamber | null>
  findById(id: string): Promise<Chamber | null>
  delete(id: string): Promise<void>
}
