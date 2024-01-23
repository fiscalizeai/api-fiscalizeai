import { PrismaChamberRecordsRepository } from '@/repositories/prisma/prisma-chamber-records-repository'
import { DeleteChamberRecordUseCase } from '@/use-cases/chamber-records/delete'

export function makeDeleteUseCase() {
  const chamberRecordsRepository = new PrismaChamberRecordsRepository()
  const useCase = new DeleteChamberRecordUseCase(chamberRecordsRepository)

  return useCase
}
