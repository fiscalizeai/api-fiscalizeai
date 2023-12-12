import { UsersRepository } from '@/repositories/users'
import { User } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface FetchUsersByNameUseCaseRequest {
  name: string
  page: number
}

interface FetchUsersByNameUserCaseResponse {
  users: User[] | null
}

export class FetchUsersByNameUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    page,
    name,
  }: FetchUsersByNameUseCaseRequest): Promise<FetchUsersByNameUserCaseResponse> {
    const users = await this.userRepository.fetchByName(name, page)

    if (!users) {
      throw new ResouceNotFoundError()
    }

    return {
      users,
    }
  }
}
