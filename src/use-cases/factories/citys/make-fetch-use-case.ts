import { PrismaCitysRepository } from '@/repositories/prisma/prisma-citys-repository'
import { FetchUseCase } from '@/use-cases/citys/fetch'

export function makeFetchUseCase() {
  const citysRepository = new PrismaCitysRepository()
  const useCase = new FetchUseCase(citysRepository)

  return useCase
}
