import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserByCpfUseCase } from '@/use-cases/users/get-user-by-cpf'

export function makeFetchByChamberUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserByCpfUseCase(usersRepository)

  return useCase
}
