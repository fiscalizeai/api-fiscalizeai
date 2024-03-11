import { Prisma, Health } from '@prisma/client'

export interface HealthRecordsRepository {
  register(data: Prisma.HealthUncheckedCreateInput): Promise<Health>
  findByMonthAndYear(
    month: number | Prisma.IntFieldUpdateOperationsInput,
    year: number | Prisma.IntFieldUpdateOperationsInput,
    cityId: string,
  ): Promise<Health | null>
  fetch(
    page: number,
    cityId: string,
    items?: number,
    month?: number,
    year?: number,
  ): Promise<{
    health: Health[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  }>
  edit(
    HealthId: string,
    data: Prisma.HealthUncheckedUpdateInput,
  ): Promise<Health | null>
  findById(id: string): Promise<Health | null>
  delete(id: string): Promise<void>
}
