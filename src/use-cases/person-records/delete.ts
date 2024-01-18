import { PersonRecordsRepository } from '@/repositories/person'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface DeletePersonRecordUseCaseRequest {
  id: string
}

export class DeletePersonRecordUseCase {
  constructor(private personRecords: PersonRecordsRepository) {}

  async execute({ id }: DeletePersonRecordUseCaseRequest): Promise<void> {
    const personRecord = await this.personRecords.findById(id)

    if (!personRecord) {
      throw new RecordsNotExistsError()
    }

    await this.personRecords.delete(id)
  }
}
