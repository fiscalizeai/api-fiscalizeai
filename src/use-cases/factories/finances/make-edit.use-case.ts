import { PrismaFinancesRepository } from '@/repositories/prisma/prisma-finances-repository'
import { EditFinanceUseCase } from '@/use-cases/finances/edit'

export function makeEditUseCase() {
  const financesRepository = new PrismaFinancesRepository()
  const useCase = new EditFinanceUseCase(financesRepository)

  return useCase
}
