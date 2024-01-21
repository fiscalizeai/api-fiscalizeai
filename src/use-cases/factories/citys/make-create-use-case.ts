import { PrismaCitysRepository } from '@/repositories/prisma/prisma-citys-repository'
import { CreateCityUseCase } from '@/use-cases/citys/create'

export function makeCreateUseCase() {
  const citysRepository = new PrismaCitysRepository()
  const useCase = new CreateCityUseCase(citysRepository)

  return useCase
}
