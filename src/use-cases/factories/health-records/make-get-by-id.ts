import { PrismaHealthRecordsRepository } from '@/repositories/prisma/prisma-health-records-repository'
import { GetHealthRecordByIdUseCase } from '@/use-cases/health-records/get-by-id'

export function makeGetByIdUseCase() {
  const healthRecordsRepository = new PrismaHealthRecordsRepository()
  const useCase = new GetHealthRecordByIdUseCase(healthRecordsRepository)

  return useCase
}
