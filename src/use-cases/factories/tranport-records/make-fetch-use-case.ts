import { PrismaTransportRecordsRepository } from '@/repositories/prisma/prisma-transport-records-repository'
import { FetchTransportRecordsUseCase } from '@/use-cases/transport-records/fetch'

export function makeFetchUseCase() {
  const transportRecordsRepository = new PrismaTransportRecordsRepository()
  const useCase = new FetchTransportRecordsUseCase(transportRecordsRepository)

  return useCase
}
