import { Prisma, Health } from '@prisma/client'

export interface HealthRecordsRepository {
  register(data: Prisma.HealthUncheckedCreateInput): Promise<Health>
  findByMonthAndYear(date: Date): Promise<Health | null>
  fetch(
    page: number,
    cityId: string,
    items?: number,
    date?: Date,
  ): Promise<Health[] | null>
  edit(
    HealthId: string,
    data: Prisma.HealthUncheckedUpdateInput,
  ): Promise<Health | null>
  findById(id: string): Promise<Health | null>
  delete(id: string): Promise<void>
}
