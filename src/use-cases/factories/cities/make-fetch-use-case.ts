import { PrismaCitysRepository } from '@/repositories/prisma/prisma-cities-repository'
import { FetchUseCase } from '@/use-cases/cities/fetch'

export function makeFetchUseCase() {
  const citiesRepository = new PrismaCitysRepository()
  const useCase = new FetchUseCase(citiesRepository)

  return useCase
}
