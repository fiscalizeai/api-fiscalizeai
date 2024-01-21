import { Prisma, Education } from '@prisma/client'

export interface EducationRecordsRepository {
  register(data: Prisma.EducationUncheckedCreateInput): Promise<Education>
  findByMonthAndYear(date: Date): Promise<Education | null>
  fetch(
    page: number,
    cityId: string,
    items?: number,
    date?: Date,
  ): Promise<{
    education: Education[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  } | null>
  edit(
    educationId: string,
    data: Prisma.EducationUncheckedUpdateInput,
  ): Promise<Education | null>
  findById(id: string): Promise<Education | null>
  delete(id: string): Promise<void>
}
