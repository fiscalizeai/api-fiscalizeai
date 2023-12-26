import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { EditUserUseCase } from '@/use-cases/users/edit'

export function makeEditUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new EditUserUseCase(usersRepository)

  return useCase
}
