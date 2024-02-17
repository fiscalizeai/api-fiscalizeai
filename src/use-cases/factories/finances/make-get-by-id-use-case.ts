import { PrismaFinancesRepository } from '@/repositories/prisma/prisma-finances-repository'
import { PrismaTransferRepository } from '@/repositories/prisma/prisma-transfer-repository'
import { GetFinanceByIdUseCase } from '@/use-cases/finances/get-by-id'

export function makeGetByIdUseCase() {
  const financesRepository = new PrismaFinancesRepository()
  const transfersRepository = new PrismaTransferRepository()
  const useCase = new GetFinanceByIdUseCase(
    financesRepository,
    transfersRepository,
  )

  return useCase
}
