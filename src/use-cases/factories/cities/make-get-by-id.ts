import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository'
import { GetCityByIdUseCase } from '@/use-cases/cities/get-by-id'

export function makeGetByIdUseCase() {
  const citiesRepository = new PrismaCitiesRepository()
  const useCase = new GetCityByIdUseCase(citiesRepository)

  return useCase
}
