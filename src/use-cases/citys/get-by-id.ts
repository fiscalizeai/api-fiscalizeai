import { City, User } from '@prisma/client'
import { CitysRepository } from '@/repositories/citys'
import { CityNotFoundError } from '../errors/citys/city-not-found'

interface GetCityByIdUseCaseRequest {
  id: string
}

interface GetCityByIdCaseResponse {
  city: City | null
  users: User[]
  usersCount: number
}

export class GetCityByIdUseCase {
  constructor(private cityRepository: CitysRepository) {}

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
