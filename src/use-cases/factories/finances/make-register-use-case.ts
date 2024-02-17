import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository'
import { PrismaFinancesRepository } from '@/repositories/prisma/prisma-finances-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterFinancesUseCase } from '@/use-cases/finances/register'

export function makeRegisterUseCase() {
  const financesRepository = new PrismaFinancesRepository()
  const usersRepository = new PrismaUsersRepository()
  const citiesRepository = new PrismaCitiesRepository()
  const useCase = new RegisterFinancesUseCase(
    financesRepository,
    usersRepository,
    citiesRepository,
  )

  return useCase
}
