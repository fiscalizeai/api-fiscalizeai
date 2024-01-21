import { PrismaCitysRepository } from '@/repositories/prisma/prisma-citys-repository'
import { DeleteCityUseCase } from '@/use-cases/citys/delete'

export function makeDeleteUseCase() {
  const citysRepository = new PrismaCitysRepository()
  const useCase = new DeleteCityUseCase(citysRepository)

  return useCase
}
