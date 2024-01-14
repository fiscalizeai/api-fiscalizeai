import { PrismaEducationRecordsRepository } from '@/repositories/prisma/prisma-education-records-repository'
import { GetEducationRecordByIdUseCase } from '@/use-cases/education-records/get-by-id'

export function makeGetByIdUseCase() {
  const educationRecordsRepository = new PrismaEducationRecordsRepository()
  const useCase = new GetEducationRecordByIdUseCase(educationRecordsRepository)

  return useCase
}
