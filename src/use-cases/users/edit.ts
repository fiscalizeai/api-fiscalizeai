import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users'
import { hash } from 'bcryptjs'
import { UserNotFoundError } from '../errors/users/user-not-found'

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
      throw new UserNotFoundError()
    }

    const { password } = user

    let password_hash

    if (data.password) {
      password_hash = await hash(data.password.toString(), 6)
    }

    const userEdited = await this.usersRepository.edit(userId, {
      ...data,
      password: password_hash || password,
    })

    return {
      userEdited,
    }
  }
}
