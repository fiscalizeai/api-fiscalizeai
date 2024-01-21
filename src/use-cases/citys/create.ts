import { City } from '@prisma/client'
import { CitysRepository } from '@/repositories/citys'
import { CityAlreadyExistsError } from '../errors/citys/city-already-exists'

interface CreateCityUseCaseRequest {
  name: string
  state: string
}

interface CreateCityUserCaseResponse {
  city: City
}

export class CreateCityUseCase {
  constructor(private cityRepository: CitysRepository) {}

  async execute({
    name,
    state,
  }: CreateCityUseCaseRequest): Promise<CreateCityUserCaseResponse> {
    const cityWithSameName = await this.cityRepository.findByName(
      name,
      state,
    )

    if (cityWithSameName) {
      throw new CityAlreadyExistsError()
    }

    const city = await this.cityRepository.create({
      name,
      state,
    })

    return {
      city,
    }
  }
}
