import { PrismaPersonRecordsRepository } from '@/repositories/prisma/prisma-person-records-repository'
import { DeletePersonRecordUseCase } from '@/use-cases/person-records/delete'

export function makeDeleteUseCase() {
  const personRecordsRepository = new PrismaPersonRecordsRepository()
  const useCase = new DeletePersonRecordUseCase(personRecordsRepository)

  return useCase
}
