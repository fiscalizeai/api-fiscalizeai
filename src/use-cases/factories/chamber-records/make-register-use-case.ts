import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository'
import { PrismaChamberRecordsRepository } from '@/repositories/prisma/prisma-chamber-records-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterChamberRecordsUseCase } from '@/use-cases/chamber-records/register'

export function makeRegisterUseCase() {
  const chamberRecordsRepository = new PrismaChamberRecordsRepository()
  const usersRepository = new PrismaUsersRepository()
  const citiesRepository = new PrismaCitiesRepository()
  const useCase = new RegisterChamberRecordsUseCase(
    chamberRecordsRepository,
    usersRepository,
    citiesRepository,
  )

  return useCase
}
