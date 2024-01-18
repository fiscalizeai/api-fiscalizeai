import { PrismaHealthRecordsRepository } from '@/repositories/prisma/prisma-health-records-repository'
import { EditHealthRecordUseCase } from '@/use-cases/health-records/edit'

export function makeEditUseCase() {
  const healthRecordsRepository = new PrismaHealthRecordsRepository()
  const useCase = new EditHealthRecordUseCase(healthRecordsRepository)

  return useCase
}
