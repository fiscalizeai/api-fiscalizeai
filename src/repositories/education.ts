import { Prisma, Education } from '@prisma/client'

export interface EducationRecordsRepository {
  register(data: Prisma.EducationUncheckedCreateInput): Promise<Education>
  findByMonthAndYear(
    month: number | Prisma.IntFieldUpdateOperationsInput,
    year: number | Prisma.IntFieldUpdateOperationsInput,
    cityId: string,
  ): Promise<Education | null>
  fetch(
    page: number,
    cityId: string,
    items?: number,
    month?: number,
    year?: number,
  ): Promise<{
    education: Education[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  }>
  edit(
    educationId: string,
    data: Prisma.EducationUncheckedUpdateInput,
  ): Promise<Education | null>
  findById(id: string): Promise<Education | null>
  delete(id: string): Promise<void>
}
