import { CitysRepository } from '@/repositories/citys'
import { UsersRepository } from '@/repositories/users'
import { CityAssociatedUsers } from '../errors/citys/city-associated-users'
import { CityNotFoundError } from '../errors/citys/city-not-found'

interface DeleteCityUseCaseRequest {
  id: string
}

export class DeleteCityUseCase {
  constructor(
    private cityRepository: CitysRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ id }: DeleteCityUseCaseRequest): Promise<void> {
    const city = await this.cityRepository.findById(id)

    if (!city) {
      throw new CityNotFoundError()
    }

    const usersCount = await this.cityRepository.countUsersByCity(id)

    if (usersCount > 0) {
      throw new CityAssociatedUsers()
    }

    await this.cityRepository.delete(id)
  }
}
