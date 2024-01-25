import { PrismaTransferRepository } from '@/repositories/prisma/prisma-transfer-repository'
import { GetTransferByIdUseCase } from '@/use-cases/transfer/get-by-id'

export function makeGetByIdUseCase() {
  const transfersRepository = new PrismaTransferRepository()
  const useCase = new GetTransferByIdUseCase(transfersRepository)

  return useCase
}
