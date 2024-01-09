import { ChambersRepository } from '@/repositories/chambers'
import { UsersRepository } from '@/repositories/users'
import { ChamberAssociatedUsers } from '../errors/chambers/chamber-associated-users'
import { ChamberNotFound } from '../errors/chambers/chamber-not-found'

interface DeleteChamberUseCaseRequest {
  id: string
}

export class DeleteChamberUseCase {
  constructor(
    private chamberRepository: ChambersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ id }: DeleteChamberUseCaseRequest): Promise<void> {
    const chamber = await this.chamberRepository.findById(id)

    if (!chamber) {
      throw new ChamberNotFound()
    }

    const usersCount = await this.chamberRepository.countUsersByChamber(id)

    if (usersCount > 0) {
      throw new ChamberAssociatedUsers()
    }

    await this.chamberRepository.delete(id)
  }
}
