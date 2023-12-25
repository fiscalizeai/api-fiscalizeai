import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FetchUserByChamberUseCase } from '@/use-cases/users/fetch-by-chamber'

export function makeFetchByChamberUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new FetchUserByChamberUseCase(
    usersRepository,
    chambersRepository,
  )

  return useCase
}
