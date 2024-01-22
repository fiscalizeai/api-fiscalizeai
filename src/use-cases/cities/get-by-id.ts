import { City, User } from '@prisma/client'
import { CitiesRepository } from '@/repositories/cities'
import { CityNotFoundError } from '../errors/cities/city-not-found'

interface GetCityByIdUseCaseRequest {
  id: string
}

interface GetCityByIdCaseResponse {
  city: City | null
  users: User[]
  usersCount: number
}

export class GetCityByIdUseCase {
  constructor(private cityRepository: CitiesRepository) {}

  async execute({
    id,
  }: GetCityByIdUseCaseRequest): Promise<GetCityByIdCaseResponse> {
    const city = await this.cityRepository.findById(id)
    const usersCount = await this.cityRepository.countUsersByCity(id)
    const users = await this.cityRepository.fetchUserInCity(id)

    if (!city) {
      throw new CityNotFoundError()
    }

    return {
      city,
      usersCount,
      users,
    }
  }
}
