import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository'
import { PrismaPersonRecordsRepository } from '@/repositories/prisma/prisma-person-records-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterPersonRecordsUseCase } from '@/use-cases/person-records/register'

export function makeRegisterUseCase() {
  const personRecordsRepository = new PrismaPersonRecordsRepository()
  const usersRepository = new PrismaUsersRepository()
  const citiesRepository = new PrismaCitiesRepository()
  const useCase = new RegisterPersonRecordsUseCase(
    personRecordsRepository,
    usersRepository,
    citiesRepository,
  )

  return useCase
}
