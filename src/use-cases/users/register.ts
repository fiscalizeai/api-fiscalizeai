import { UsersRepository } from '@/repositories/users'
import { Role, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists'
import { CitiesRepository } from '@/repositories/cities'
import { CityNotFoundError } from '../errors/cities/city-not-found'

interface RegisterUseCaseRequest {
  name: string
  email: string
  cpf: string
  role: Role
  cityId: string
}

interface RegisterUserCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(
    private userRepository: UsersRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    name,
    email,
    cpf,
    role,
    cityId,
  }: RegisterUseCaseRequest): Promise<RegisterUserCaseResponse> {
    const password_hash = await hash(cpf, 6)

    const usersWithSameEmail = await this.userRepository.findByEmail(email)

    const userWithSameCpf = await this.userRepository.findByCpf(cpf)

    if (usersWithSameEmail || userWithSameCpf) {
      throw new UserAlreadyExistsError()
    }

    const city = await this.citiesRepository.findById(cityId)

    if (!city) {
      throw new CityNotFoundError()
    }

    const user = await this.userRepository.create({
      name,
      email,
      cpf,
      password: password_hash,
      role,
      city_id: cityId,
    })

    return {
      user,
    }
  }
}
