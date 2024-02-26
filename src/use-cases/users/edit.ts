import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users'
import { hash } from 'bcryptjs'
import { UserNotFoundError } from '../errors/users/user-not-found'
import { UserAlreadyExistsError } from '../errors/user-already-exists'

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

    if (data.email && data.email !== user.email) {
      const isSameEmail = await this.usersRepository.findByEmail(
        data.email.toString(),
      )

      if (isSameEmail) {
        throw new UserAlreadyExistsError()
      }
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
