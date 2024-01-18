import { UsersRepository } from '@/repositories/users'
import { Role, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists'

interface RegisterUseCaseRequest {
  name: string
  email: string
  cpf: string
  role: Role
  chamberId?: string
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
    role,
    chamberId,
  }: RegisterUseCaseRequest): Promise<RegisterUserCaseResponse> {
    const password_hash = await hash(cpf, 6)

    const usersWithSameEmail = await this.userRepository.findByEmail(email)

    const userWithSameCpf = await this.userRepository.findByCpf(cpf)

    if (usersWithSameEmail || userWithSameCpf) {
      throw new UserAlreadyExistsError()
    }

    let user

    if (chamberId) {
      user = await this.userRepository.create({
        name,
        email,
        cpf,
        password: password_hash,
        role,
        chamber_id: chamberId,
      })
    } else {
      user = await this.userRepository.create({
        name,
        email,
        cpf,
        password: password_hash,
        role,
        chamber_id: '',
      })
    }

    return {
      user,
    }
  }
}
