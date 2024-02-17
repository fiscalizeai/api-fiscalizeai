import { PrismaFinancesRepository } from '@/repositories/prisma/prisma-finances-repository'
import { DeleteFinanceUseCase } from '@/use-cases/finances/delete'

export function makeDeleteUseCase() {
  const financesRepository = new PrismaFinancesRepository()
  const useCase = new DeleteFinanceUseCase(financesRepository)

  return useCase
}
