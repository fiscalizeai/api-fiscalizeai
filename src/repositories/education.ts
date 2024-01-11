import { Prisma, Education } from '@prisma/client'

export interface EducationRecordsRepository {
  register(data: Prisma.EducationUncheckedCreateInput): Promise<Education>
  findByMonthAndYear(date: Date): Promise<Education | null>
  fetch(
    page: number,
    chamberId: string,
    items?: number,
    date?: Date,
  ): Promise<Education[] | null>
}
