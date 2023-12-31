import { UsersRepository } from '@/repositories/users'
import { User } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface FetchUserUseCaseRequest {
  page: number
}

interface FetchUserUseCaseResponse {
  users: User[]
}

export class FetchUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    page,
  }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse> {
    const users = await this.userRepository.fetch(page)

    if (!users) {
      throw new ResouceNotFoundError()
    }

    return {
      users,
    }
  }
}
