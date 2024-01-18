import { PrismaPersonRecordsRepository } from '@/repositories/prisma/prisma-person-records-repository'
import { GetPersonRecordByIdUseCase } from '@/use-cases/person-records/get-by-id'

export function makeGetByIdUseCase() {
  const personRecordsRepository = new PrismaPersonRecordsRepository()
  const useCase = new GetPersonRecordByIdUseCase(personRecordsRepository)

  return useCase
}
