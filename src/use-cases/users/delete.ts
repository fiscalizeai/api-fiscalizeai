import { UsersRepository } from '@/repositories/users'
import { UserNotFoundError } from '../errors/users/user-not-found'

interface DeleteUserUseCaseRequest {
  id: string
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserUseCaseRequest): Promise<void> {
    const user = this.usersRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    await this.usersRepository.delete(id)
  }
}
