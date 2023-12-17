import { UsersRepository } from '@/repositories/users'
import { User } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface GetUserInfoUseCaseRequest {
  userId: string
}

interface GetUserInfoUseCaseResponse {
  user: User
}

export class GetUserInfoUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserInfoUseCaseRequest): Promise<GetUserInfoUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResouceNotFoundError()
    }

    return {
      user,
    }
  }
}
