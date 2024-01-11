import { PrismaEducationRecordsRepository } from '@/repositories/prisma/prisma-education-records-repository'
import { FetchEducationRecordsUseCase } from '@/use-cases/education-records/fetch'

export function makeFetchUseCase() {
  const educationRecordsRepository = new PrismaEducationRecordsRepository()
  const useCase = new FetchEducationRecordsUseCase(educationRecordsRepository)

  return useCase
}
