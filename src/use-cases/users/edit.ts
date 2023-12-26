import { Prisma, User } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { UsersRepository } from '@/repositories/users'

interface EditUserUseCaseRequest {
  userId: string
  data: Prisma.UserUncheckedUpdateInput
}

interface EditUserUseCaseResponse {
  userEdited: User | null
}

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    data,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResouceNotFoundError() // TODO: Colocar o erro certo!
    }

    const userEdited = await this.usersRepository.edit(userId, data)

    return {
      userEdited,
    }
  }
}
