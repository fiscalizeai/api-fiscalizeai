import { PrismaEducationRecordsRepository } from '@/repositories/prisma/prisma-education-records-repository'
import { EditEducationRecordUseCase } from '@/use-cases/education-records/edit'

export function makeEditUseCase() {
  const educationRecordsRepository = new PrismaEducationRecordsRepository()
  const useCase = new EditEducationRecordUseCase(educationRecordsRepository)

  return useCase
}
