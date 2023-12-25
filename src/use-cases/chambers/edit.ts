import { Chamber, Prisma } from '@prisma/client'
import { ChambersRepository } from '@/repositories/chambers'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface EditChamberUseCaseRequest {
  id: string
  data: Prisma.ChamberUncheckedUpdateInput
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
      throw new ResouceNotFoundError() // TODO: Colocar o erro certo!
    }

    const chamberEdited = await this.chamberRepository.edit(id, data)

    return {
      chamberEdited,
    }
  }
}
