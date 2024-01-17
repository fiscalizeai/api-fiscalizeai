import { PrismaTransportRecordsRepository } from '@/repositories/prisma/prisma-transport-records-repository'
import { GetTransportRecordByIdUseCase } from '@/use-cases/transport-records/get-by-id'

export function makeGetByIdUseCase() {
  const transportRecordsRepository = new PrismaTransportRecordsRepository()
  const useCase = new GetTransportRecordByIdUseCase(transportRecordsRepository)

  return useCase
}
