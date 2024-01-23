import { UsersRepository } from '@/repositories/users'
import { User } from '@prisma/client'
import { InvalidCredentialsError } from '../errors/invalid-credentials'
import { compare } from 'bcryptjs'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    if (user.status === 'DENIED') {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
