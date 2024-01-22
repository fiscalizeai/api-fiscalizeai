import { City } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { CitysRepository } from '@/repositories/cities'

interface FetchUseCaseRequest {
  page: number
  items?: number
  name?: string
  state?: string
}

interface FetchUseCaseResponse {
  cities: City[]
  pagination: {
    totalItems: number
    pageSize: number
    pageNumber: number
    pageItems: number
  }
}

export class FetchUseCase {
  constructor(private cityRepository: CitysRepository) {}

  async execute({
    page,
    items,
    name,
    state,
  }: FetchUseCaseRequest): Promise<FetchUseCaseResponse> {
    const params: { [key: string]: string | undefined } = {
      name,
      state,
    }

    // Remove chaves cujos valores sao undefined
    // Para evitar filtragem por campos nao fornecidos
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key],
    )

    const citiesReturn = await this.cityRepository.fetch(page, items, params)

    if (!citiesReturn) {
      throw new ResouceNotFoundError() // TODO: Switch this error for correctly error.
    }

    const { cities, pagination } = citiesReturn

    return {
      cities,
      pagination,
    }
  }
}
