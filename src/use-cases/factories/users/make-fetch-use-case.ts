import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FetchUserUseCase } from '@/use-cases/users/fetch'

export function makeFetchUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new FetchUserUseCase(usersRepository)

  return useCase
}
