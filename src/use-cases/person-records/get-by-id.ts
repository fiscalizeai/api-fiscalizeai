import { Person } from '@prisma/client'
import { PersonRecordsRepository } from '@/repositories/person'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface GetPersonRecordByIdUseCaseRequest {
  id: string
}

interface GetPersonRecordByIdCaseResponse {
  personRecord: Person | null
}

export class GetPersonRecordByIdUseCase {
  constructor(private personRecordsRepository: PersonRecordsRepository) {}

  async execute({
    id,
  }: GetPersonRecordByIdUseCaseRequest): Promise<GetPersonRecordByIdCaseResponse> {
    const personRecord = await this.personRecordsRepository.findById(id)

    if (!personRecord) {
      throw new RecordsNotExistsError()
    }

    return {
      personRecord,
    }
  }
}
