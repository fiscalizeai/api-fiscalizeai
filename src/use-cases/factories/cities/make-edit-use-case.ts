import { PrismaCitiesRepository } from '@/repositories/prisma/prisma-cities-repository'
import { EditCityUseCase } from '@/use-cases/cities/edit'

export function makeEditUseCase() {
  const citiesRepository = new PrismaCitiesRepository()
  const useCase = new EditCityUseCase(citiesRepository)

  return useCase
}
