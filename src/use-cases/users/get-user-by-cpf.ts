import { UsersRepository } from '@/repositories/users'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface GetUserByCpfUseCaseRequest {
  cpf: string
}

interface GetUserByCpfUserCaseResponse {
  user: User | null
}

export class GetUserByCpfUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    cpf,
  }: GetUserByCpfUseCaseRequest): Promise<GetUserByCpfUserCaseResponse> {
    const user = await this.userRepository.findByCpf(cpf)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
