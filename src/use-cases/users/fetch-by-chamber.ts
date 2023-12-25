import { UsersRepository } from '@/repositories/users'
import { User } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { ChambersRepository } from '@/repositories/chambers'

interface FetchUserByChamberUseCaseRequest {
  city: string
  state: string
  page: number
}

interface FetchUserByChamberUserCaseResponse {
  users: User[]
}

export class FetchUserByChamberUseCase {
  constructor(
    private userRepository: UsersRepository,
    private chambersRepository: ChambersRepository,
  ) {}

  async execute({
    page,
    city,
    state,
  }: FetchUserByChamberUseCaseRequest): Promise<FetchUserByChamberUserCaseResponse> {
    const chamber = await this.chambersRepository.findByName(city, state)

    if (!chamber) {
      throw new ResouceNotFoundError()
    }

    const users = await this.userRepository.fetchByChamber(chamber.id, page)

    if (!users) {
      throw new ResouceNotFoundError()
    }

    return {
      users,
    }
  }
}
