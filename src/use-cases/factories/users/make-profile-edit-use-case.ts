import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ProfileEditUserUseCase } from '@/use-cases/users/profile-edit'

export function makeProfileEditUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new ProfileEditUserUseCase(usersRepository)

  return useCase
}
