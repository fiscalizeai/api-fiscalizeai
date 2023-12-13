import { Chamber } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { ChambersRepository } from '@/repositories/chambers'

interface GetChamberUseCaseRequest {
  name: string
  state: string
}

interface GetChamberCaseResponse {
  chamber: Chamber | null
}

export class GetChamberUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({
    name,
    state,
  }: GetChamberUseCaseRequest): Promise<GetChamberCaseResponse> {
    const chamber = await this.chamberRepository.findByName(name, state)

    if (!chamber) {
      throw new ResouceNotFoundError() // TODO: Switch this error for correctly error.
    }

    return {
      chamber,
    }
  }
}
