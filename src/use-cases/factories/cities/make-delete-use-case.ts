import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteCityUseCase } from '@/use-cases/cities/delete'

export function makeDeleteUseCase() {
  const citiesRepository = new PrismaCitiesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new DeleteCityUseCase(citiesRepository, usersRepository)

  return useCase
}
