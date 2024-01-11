import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { PrismaEducationRecordsRepository } from '@/repositories/prisma/prisma-education-records-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterEducationRecordsUseCase } from '@/use-cases/education-records/register'

export function makeRegisterUseCase() {
  const educationRecordsRepository = new PrismaEducationRecordsRepository()
  const usersRepository = new PrismaUsersRepository()
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new RegisterEducationRecordsUseCase(
    educationRecordsRepository,
    usersRepository,
    chambersRepository,
  )

  return useCase
}
