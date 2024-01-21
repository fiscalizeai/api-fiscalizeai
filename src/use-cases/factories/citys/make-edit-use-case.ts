import { PrismaCitysRepository } from '@/repositories/prisma/prisma-citys-repository'
import { EditCityUseCase } from '@/use-cases/citys/edit'

export function makeEditUseCase() {
  const citysRepository = new PrismaCitysRepository()
  const useCase = new EditCityUseCase(citysRepository)

  return useCase
}
