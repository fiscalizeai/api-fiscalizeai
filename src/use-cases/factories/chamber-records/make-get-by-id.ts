import { PrismaChamberRecordsRepository } from '@/repositories/prisma/prisma-chamber-records-repository'
import { GetChamberRecordByIdUseCase } from '@/use-cases/chamber-records/get-by-id'

export function makeGetByIdUseCase() {
  const chamberRecordsRepository = new PrismaChamberRecordsRepository()
  const useCase = new GetChamberRecordByIdUseCase(chamberRecordsRepository)

  return useCase
}
