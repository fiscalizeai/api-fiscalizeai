import { PrismaHealthRecordsRepository } from '@/repositories/prisma/prisma-health-records-repository'
import { FetchHealthRecordsUseCase } from '@/use-cases/health-records/fetch'

export function makeFetchUseCase() {
  const healthRecordsRepository = new PrismaHealthRecordsRepository()
  const useCase = new FetchHealthRecordsUseCase(healthRecordsRepository)

  return useCase
}
