import { CitiesRepository } from '@/repositories/cities'
import { UsersRepository } from '@/repositories/users'
import { CityAssociatedUsers } from '../errors/cities/city-associated-users'
import { CityNotFoundError } from '../errors/cities/city-not-found'

interface DeleteCityUseCaseRequest {
  id: string
}

export class DeleteCityUseCase {
  constructor(
    private cityRepository: CitiesRepository,
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
