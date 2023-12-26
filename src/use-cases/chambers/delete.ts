import { ChambersRepository } from '@/repositories/chambers'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface DeleteChamberUseCaseRequest {
  id: string
}

export class DeleteChamberUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({ id }: DeleteChamberUseCaseRequest): Promise<void> {
    const chamber = this.chamberRepository.findById(id)

    if (!chamber) {
      throw new ResouceNotFoundError()
    }

    await this.chamberRepository.delete(id)
  }
}
