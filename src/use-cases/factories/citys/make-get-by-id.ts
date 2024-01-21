import { PrismaCitysRepository } from '@/repositories/prisma/prisma-citys-repository'
import { GetCityByIdUseCase } from '@/use-cases/citys/get-by-id'

export function makeGetByIdUseCase() {
  const citysRepository = new PrismaCitysRepository()
  const useCase = new GetCityByIdUseCase(citysRepository)

  return useCase
}
