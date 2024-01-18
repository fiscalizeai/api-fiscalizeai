import { PrismaPersonRecordsRepository } from '@/repositories/prisma/prisma-person-records-repository'
import { FetchPersonRecordsUseCase } from '@/use-cases/person-records/fetch'

export function makeFetchUseCase() {
  const personRecordsRepository = new PrismaPersonRecordsRepository()
  const useCase = new FetchPersonRecordsUseCase(personRecordsRepository)

  return useCase
}
