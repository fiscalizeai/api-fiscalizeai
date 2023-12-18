import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserInfoUseCase } from '@/use-cases/users/get-user-info'

export function makeGetUserInfoUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserInfoUseCase(usersRepository)

  return useCase
}
