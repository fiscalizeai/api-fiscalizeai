import { Chamber } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { ChambersRepository } from '@/repositories/chambers'

interface FetchByStateUseCaseRequest {
  state: string
  page: number
}

interface FetchByStateUseCaseResponse {
  chambers: Chamber[] | null
}

export class FetchByStateUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({
    page,
    state,
  }: FetchByStateUseCaseRequest): Promise<FetchByStateUseCaseResponse> {
    const chambers = await this.chamberRepository.findByState(state, page)

    if (!chambers) {
      throw new ResouceNotFoundError() // TODO: Switch this error for correctly error.
    }

    return {
      chambers,
    }
  }
}
