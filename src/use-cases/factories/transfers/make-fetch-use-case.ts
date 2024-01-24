import { PrismaTransferRepository } from '@/repositories/prisma/prisma-transfer-repository'
import { FetchTransferUseCase } from '@/use-cases/transfer/fetch'

export function makeFetchUseCase() {
  const transfersRepository = new PrismaTransferRepository()
  const useCase = new FetchTransferUseCase(transfersRepository)

  return useCase
}
