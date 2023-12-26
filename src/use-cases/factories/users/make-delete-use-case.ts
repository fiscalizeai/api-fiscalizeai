import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteUserUseCase } from '@/use-cases/users/delete'

export function makeDeleteUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new DeleteUserUseCase(usersRepository)

  return useCase
}
