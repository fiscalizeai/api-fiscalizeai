import { PrismaChamberRecordsRepository } from '@/repositories/prisma/prisma-chamber-records-repository'
import { EditChamberRecordUseCase } from '@/use-cases/chamber-records/edit'

export function makeEditUseCase() {
  const chamberRecordsRepository = new PrismaChamberRecordsRepository()
  const useCase = new EditChamberRecordUseCase(chamberRecordsRepository)

  return useCase
}
