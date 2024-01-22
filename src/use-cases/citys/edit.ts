import { City, Prisma } from '@prisma/client'
import { CitysRepository } from '@/repositories/cities'
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
  constructor(private cityRepository: CitysRepository) {}

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

    const cityEdited = await this.cityRepository.edit(id, data)

    return {
      cityEdited,
    }
  }
}
