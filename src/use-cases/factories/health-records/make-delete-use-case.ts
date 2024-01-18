import { PrismaHealthRecordsRepository } from '@/repositories/prisma/prisma-health-records-repository'
import { DeleteHealthRecordUseCase } from '@/use-cases/health-records/delete'

export function makeDeleteUseCase() {
  const healthRecordsRepository = new PrismaHealthRecordsRepository()
  const useCase = new DeleteHealthRecordUseCase(healthRecordsRepository)

  return useCase
}
