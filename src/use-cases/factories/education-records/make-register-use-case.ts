import { PrismaEducationRecordsRepository } from '@/repositories/prisma/prisma-education-records-repository'
import { RegisterEducationRecordsUseCase } from '@/use-cases/education-records/register'

export function makeRegisterUseCase() {
  const educationRecordsRepository = new PrismaEducationRecordsRepository()
  const useCase = new RegisterEducationRecordsUseCase(
    educationRecordsRepository,
  )

  return useCase
}
