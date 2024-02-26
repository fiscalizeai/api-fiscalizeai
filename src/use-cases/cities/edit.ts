import { City, Prisma } from '@prisma/client'
import { CitiesRepository } from '@/repositories/cities'
import { CityNotFoundError } from '../errors/cities/city-not-found'
import { CityAlreadyExistsError } from '../errors/cities/city-already-exists'

interface EditCityUseCaseRequest {
  id: string
  data: Prisma.CityUncheckedCreateInput
}

interface EditCityUseCaseResponse {
  cityEdited: City | null
}

export class EditCityUseCase {
  constructor(private cityRepository: CitiesRepository) {}

  async execute({
    id,
    data,
  }: EditCityUseCaseRequest): Promise<EditCityUseCaseResponse> {
    const city = await this.cityRepository.findById(id)

    if (!city) {
      throw new CityNotFoundError()
    }

    const { name, state } = data

    const existingCity = await this.cityRepository.findByName(name, state)

    if (existingCity && existingCity.id !== id) {
      throw new CityAlreadyExistsError()
    }

    if (data?.name) {
      const words = data.name.split(' ')
      const formattedName = words
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase(),
        )
        .join(' ')
      data.name = formattedName
    }

    if (data?.state) {
      data.state = data.state.toUpperCase()
    }

    const cityEdited = await this.cityRepository.edit(id, data)

    return {
      cityEdited,
    }
  }
}
