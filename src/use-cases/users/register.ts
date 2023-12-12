import { UsersRepository } from '@/repositories/users'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists'

interface RegisterUseCaseRequest {
  name: string
  email: string
  cpf: string
  chamberId: string
}

interface RegisterUserCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    cpf,
    chamberId,
  }: RegisterUseCaseRequest): Promise<RegisterUserCaseResponse> {
    const password_hash = await hash(cpf, 6)

    const usersWithSameEmail = await this.userRepository.findByEmail(email)

    if (usersWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.userRepository.create({
      name,
      email,
      cpf,
      password: password_hash,
      chamber_id: chamberId,
    })

    return {
      user,
    }
  }
}
