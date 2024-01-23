import { UsersRepository } from '@/repositories/users'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface DeleteUserUseCaseRequest {
  id: string
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserUseCaseRequest): Promise<void> {
    const user = this.usersRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError() // TODO: Colocar o erro certo!
    }

    await this.usersRepository.delete(id)
  }
}
