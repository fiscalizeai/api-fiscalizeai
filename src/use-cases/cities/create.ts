import { City } from '@prisma/client'
import { CitiesRepository } from '@/repositories/cities'
import { CityAlreadyExistsError } from '../errors/cities/city-already-exists'

interface CreateCityUseCaseRequest {
  name: string
  state: string
}

interface CreateCityUserCaseResponse {
  city: City
}

export class CreateCityUseCase {
  constructor(private cityRepository: CitiesRepository) {}

  async execute({
    name,
    state,
  }: CreateCityUseCaseRequest): Promise<CreateCityUserCaseResponse> {
    const cityWithSameName = await this.cityRepository.findByName(name, state)

    if (cityWithSameName) {
      throw new CityAlreadyExistsError()
    }

    const formattedName = name.replace(/\b\w/g, function (char) {
      return char.toUpperCase()
    })

    const city = await this.cityRepository.create({
      name: formattedName,
      state: state.toUpperCase(),
    })

    return {
      city,
    }
  }
}
