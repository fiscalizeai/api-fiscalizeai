import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { PrismaHealthRecordsRepository } from '@/repositories/prisma/prisma-health-records-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterHealthRecordsUseCase } from '@/use-cases/health-records/register'

export function makeRegisterUseCase() {
  const healthRecordsRepository = new PrismaHealthRecordsRepository()
  const usersRepository = new PrismaUsersRepository()
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new RegisterHealthRecordsUseCase(
    healthRecordsRepository,
    usersRepository,
    chambersRepository,
  )

  return useCase
}
