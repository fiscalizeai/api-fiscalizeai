import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { PrismaPersonRecordsRepository } from '@/repositories/prisma/prisma-person-records-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterPersonRecordsUseCase } from '@/use-cases/person-records/register'

export function makeRegisterUseCase() {
  const personRecordsRepository = new PrismaPersonRecordsRepository()
  const usersRepository = new PrismaUsersRepository()
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new RegisterPersonRecordsUseCase(
    personRecordsRepository,
    usersRepository,
    chambersRepository,
  )

  return useCase
}
