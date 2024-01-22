import { PrismaCitysRepository } from '@/repositories/prisma/prisma-cities-repository'
import { PrismaTransportRecordsRepository } from '@/repositories/prisma/prisma-transport-records-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterTransportRecordsUseCase } from '@/use-cases/transport-records/register'

export function makeRegisterUseCase() {
  const transportRecordsRepository = new PrismaTransportRecordsRepository()
  const usersRepository = new PrismaUsersRepository()
  const citiesRepository = new PrismaCitysRepository()
  const useCase = new RegisterTransportRecordsUseCase(
    transportRecordsRepository,
    usersRepository,
    citiesRepository,
  )

  return useCase
}
