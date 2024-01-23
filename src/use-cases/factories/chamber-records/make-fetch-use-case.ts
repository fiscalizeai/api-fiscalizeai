import { PrismaChamberRecordsRepository } from '@/repositories/prisma/prisma-chamber-records-repository'
import { FetchChamberRecordsUseCase } from '@/use-cases/chamber-records/fetch'

export function makeFetchUseCase() {
  const chamberRecordsRepository = new PrismaChamberRecordsRepository()
  const useCase = new FetchChamberRecordsUseCase(chamberRecordsRepository)

  return useCase
}
