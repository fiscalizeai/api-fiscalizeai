import { Chamber } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { ChambersRepository } from '@/repositories/chambers'

interface FetchChambersUseCaseRequest {
  state: string
  page: number
}

interface FetchChambersCaseResponse {
  chambers: Chamber[] | null
}

export class FetchChambersUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({
    page,
    state,
  }: FetchChambersUseCaseRequest): Promise<FetchChambersCaseResponse> {
    const chambers = await this.chamberRepository.findByState(state, page)

    if (!chambers) {
      throw new ResouceNotFoundError() // TODO: Switch this error for correctly error.
    }

    return {
      chambers,
    }
  }
}
