import { PrismaPersonRecordsRepository } from '@/repositories/prisma/prisma-person-records-repository'
import { EditPersonRecordUseCase } from '@/use-cases/person-records/edit'

export function makeEditUseCase() {
  const personRecordsRepository = new PrismaPersonRecordsRepository()
  const useCase = new EditPersonRecordUseCase(personRecordsRepository)

  return useCase
}
