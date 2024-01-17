import { PrismaTransportRecordsRepository } from '@/repositories/prisma/prisma-transport-records-repository'
import { EditTransportRecordUseCase } from '@/use-cases/transport-records/edit'

export function makeEditUseCase() {
  const transportRecordsRepository = new PrismaTransportRecordsRepository()
  const useCase = new EditTransportRecordUseCase(transportRecordsRepository)

  return useCase
}
