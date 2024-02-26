import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/users/register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const citiesRepository = new PrismaCitiesRepository()
  const useCase = new RegisterUseCase(usersRepository, citiesRepository)

  return useCase
}
