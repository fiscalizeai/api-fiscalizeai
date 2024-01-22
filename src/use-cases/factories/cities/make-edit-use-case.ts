import { PrismaCitysRepository } from '@/repositories/prisma/prisma-cities-repository'
import { EditCityUseCase } from '@/use-cases/cities/edit'

export function makeEditUseCase() {
  const citiesRepository = new PrismaCitysRepository()
  const useCase = new EditCityUseCase(citiesRepository)

  return useCase
}
