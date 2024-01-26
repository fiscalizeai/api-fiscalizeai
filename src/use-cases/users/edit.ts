import { Prisma, User } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UsersRepository } from '@/repositories/users'
import { hash } from 'bcryptjs'

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
      throw new ResourceNotFoundError() // TODO: Colocar o erro certo!
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

    console.log(userEdited?.password)

    return {
      userEdited,
    }
  }
}
