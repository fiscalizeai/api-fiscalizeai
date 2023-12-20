import { UsersRepository } from '@/repositories/users'
import { User } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface SearchUsersByNameUseCaseRequest {
  query: string
  page: number
}

interface SearchUsersByNameUserCaseResponse {
  users: User[]
}

export class SearchUsersByNameUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    page,
    query,
  }: SearchUsersByNameUseCaseRequest): Promise<SearchUsersByNameUserCaseResponse> {
    const users = await this.userRepository.searchByName(query, page)

    if (!users) {
      throw new ResouceNotFoundError()
    }

    return {
      users,
    }
  }
}
