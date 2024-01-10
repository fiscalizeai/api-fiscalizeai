import { Prisma, Education } from '@prisma/client'

export interface EducationRecordsRepository {
  register(data: Prisma.EducationUncheckedCreateInput): Promise<Education>
  findByMonthAndYear(date: Date): Promise<Education | null>
}
