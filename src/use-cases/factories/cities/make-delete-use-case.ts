import { PrismaCitysRepository } from '@/repositories/prisma/prisma-cities-repository'
import { DeleteCityUseCase } from '@/use-cases/cities/delete'

export function makeDeleteUseCase() {
  const citiesRepository = new PrismaCitysRepository()
  const useCase = new DeleteCityUseCase(citiesRepository)

  return useCase
}
