import { Chamber, User } from '@prisma/client'
import { ChambersRepository } from '@/repositories/chambers'
import { ChamberNotFoundError } from '../errors/chambers/chamber-not-found'

interface GetChamberByIdUseCaseRequest {
  id: string
}

interface GetChamberByIdCaseResponse {
  chamber: Chamber | null
  users: User[]
  usersCount: number
}

export class GetChamberByIdUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({
    id,
  }: GetChamberByIdUseCaseRequest): Promise<GetChamberByIdCaseResponse> {
    const chamber = await this.chamberRepository.findById(id)
    const usersCount = await this.chamberRepository.countUsersByChamber(id)
    const users = await this.chamberRepository.fetchUserInChamber(id)

    if (!chamber) {
      throw new ChamberNotFoundError()
    }

    return {
      chamber,
      usersCount,
      users,
    }
  }
}
