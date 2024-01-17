import { Chamber, Prisma } from '@prisma/client'
import { ChambersRepository } from '@/repositories/chambers'
import { ChamberNotFoundError } from '../errors/chambers/chamber-not-found'
import { ChamberAlreadyExistsError } from '../errors/chambers/chamber-already-exists'

interface EditChamberUseCaseRequest {
  id: string
  data: Prisma.ChamberUncheckedCreateInput
}

interface EditChamberUseCaseResponse {
  chamberEdited: Chamber | null
}

export class EditChamberUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({
    id,
    data,
  }: EditChamberUseCaseRequest): Promise<EditChamberUseCaseResponse> {
    const chamber = await this.chamberRepository.findById(id)

    if (!chamber) {
      throw new ChamberNotFoundError()
    }

    const { name, state } = data

    const existingChamber = await this.chamberRepository.findByName(name, state)

    if (existingChamber && existingChamber.id !== id) {
      throw new ChamberAlreadyExistsError()
    }

    const chamberEdited = await this.chamberRepository.edit(id, data)

    return {
      chamberEdited,
    }
  }
}
