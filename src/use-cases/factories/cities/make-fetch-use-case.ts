import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository'
import { FetchUseCase } from '@/use-cases/cities/fetch'

export function makeFetchUseCase() {
  const citiesRepository = new PrismaCitiesRepository()
  const useCase = new FetchUseCase(citiesRepository)

  return useCase
}
