import { Chamber } from '@prisma/client'
import { ChambersRepository } from '@/repositories/chambers'
import { ChamberAlreadyExistsError } from '../errors/chamber-already-exists'

interface CreateChamberUseCaseRequest {
  name: string
  state: string
}

interface CreateChamberUserCaseResponse {
  chamber: Chamber
}

export class CreateChamberUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({
    name,
    state,
  }: CreateChamberUseCaseRequest): Promise<CreateChamberUserCaseResponse> {
    const chamberWithSameName = await this.chamberRepository.findByName(
      name,
      state,
    )

    if (chamberWithSameName) {
      throw new ChamberAlreadyExistsError()
    }

    const chamber = await this.chamberRepository.create({
      name,
      state,
    })

    return {
      chamber,
    }
  }
}
