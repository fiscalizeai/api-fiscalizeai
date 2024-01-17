import { PrismaTransportRecordsRepository } from '@/repositories/prisma/prisma-transport-records-repository'
import { DeleteTransportRecordUseCase } from '@/use-cases/transport-records/delete'

export function makeDeleteUseCase() {
  const transportRecordsRepository = new PrismaTransportRecordsRepository()
  const useCase = new DeleteTransportRecordUseCase(transportRecordsRepository)

  return useCase
}
