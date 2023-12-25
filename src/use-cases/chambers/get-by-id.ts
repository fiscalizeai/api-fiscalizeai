import { Chamber } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { ChambersRepository } from '@/repositories/chambers'

interface GetChamberByIdUseCaseRequest {
  id: string
}

interface GetChamberByIdCaseResponse {
  chamber: Chamber | null
}

export class GetChamberByIdUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({
    id,
  }: GetChamberByIdUseCaseRequest): Promise<GetChamberByIdCaseResponse> {
    const chamber = await this.chamberRepository.findById(id)

    if (!chamber) {
      throw new ResouceNotFoundError() // TODO: Switch this error for correctly error.
    }

    return {
      chamber,
    }
  }
}
