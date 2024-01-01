import { Chamber } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { ChambersRepository } from '@/repositories/chambers'

interface FetchUseCaseRequest {
  page: number
}

interface FetchUseCaseResponse {
  chambers: Chamber[]
}

export class FetchUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({ page }: FetchUseCaseRequest): Promise<FetchUseCaseResponse> {
    const chambers = await this.chamberRepository.fetch(page)

    if (!chambers) {
      throw new ResouceNotFoundError() // TODO: Switch this error for correctly error.
    }

    return {
      chambers,
    }
  }
}
