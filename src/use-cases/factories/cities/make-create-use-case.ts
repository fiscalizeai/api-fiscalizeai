import { PrismaCitysRepository } from '@/repositories/prisma/prisma-cities-repository'
import { CreateCityUseCase } from '@/use-cases/cities/create'

export function makeCreateUseCase() {
  const citiesRepository = new PrismaCitysRepository()
  const useCase = new CreateCityUseCase(citiesRepository)

  return useCase
}
