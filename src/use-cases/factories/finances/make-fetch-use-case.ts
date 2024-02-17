import { PrismaFinancesRepository } from '@/repositories/prisma/prisma-finances-repository'
import { FetchFinancesUseCase } from '@/use-cases/finances/fetch'

export function makeFetchUseCase() {
  const financesRepository = new PrismaFinancesRepository()
  const useCase = new FetchFinancesUseCase(financesRepository)

  return useCase
}
