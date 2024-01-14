import { PrismaEducationRecordsRepository } from '@/repositories/prisma/prisma-education-records-repository'
import { DeleteEducationRecordUseCase } from '@/use-cases/education-records/delete'

export function makeDeleteUseCase() {
  const educationRecordsRepository = new PrismaEducationRecordsRepository()
  const useCase = new DeleteEducationRecordUseCase(educationRecordsRepository)

  return useCase
}
