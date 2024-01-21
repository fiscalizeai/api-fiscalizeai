import { PrismaCitysRepository } from '@/repositories/prisma/prisma-citys-repository'
import { PrismaEducationRecordsRepository } from '@/repositories/prisma/prisma-education-records-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterEducationRecordsUseCase } from '@/use-cases/education-records/register'

export function makeRegisterUseCase() {
  const educationRecordsRepository = new PrismaEducationRecordsRepository()
  const usersRepository = new PrismaUsersRepository()
  const citysRepository = new PrismaCitysRepository()
  const useCase = new RegisterEducationRecordsUseCase(
    educationRecordsRepository,
    usersRepository,
    citysRepository,
  )

  return useCase
}
