import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { SearchUsersByNameUseCase } from '@/use-cases/users/search-users-by-name'

export function makeSearchByNameUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new SearchUsersByNameUseCase(usersRepository)

  return useCase
}
