import { UsersRepository } from '@/repositories/users'
import { Permission, Role, User } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface FetchUserUseCaseRequest {
  page: number
  items: number
  cpf?: string
  city?: string
  state?: string
  name?: string
  role?: Role
  permission?: Permission
}

interface FetchUserUseCaseResponse {
  users: User[]
}

export class FetchUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    page,
    items,
    name,
    cpf,
    role,
    permission,
    city,
    state,
  }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse> {
    const params: { [key: string]: string | undefined } = {
      permission,
      role,
      city,
      cpf,
      name,
      state,
    }

    // Remove chaves cujos valores sao undefined
    // para evitar filtragem por campos nao fornecidos
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key],
    )

    const users = await this.userRepository.fetch(page, items, params)

    if (!users) {
      throw new ResouceNotFoundError()
    }

    return {
      users,
    }
  }
}
