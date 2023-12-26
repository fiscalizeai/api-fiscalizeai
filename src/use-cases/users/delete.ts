import { UsersRepository } from '@/repositories/users'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface DeleteUserUseCaseRequest {
  id: string
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserUseCaseRequest): Promise<void> {
    const user = this.usersRepository.findById(id)

    if (!user) {
      throw new ResouceNotFoundError() // TODO: Colocar o erro certo!
    }

    await this.usersRepository.delete(id)
  }
}
