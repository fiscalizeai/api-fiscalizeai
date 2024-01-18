import { HealthRecordsRepository } from '@/repositories/health'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface DeleteHealthRecordUseCaseRequest {
  id: string
}

export class DeleteHealthRecordUseCase {
  constructor(private healthRecords: HealthRecordsRepository) {}

  async execute({ id }: DeleteHealthRecordUseCaseRequest): Promise<void> {
    const healthRecord = await this.healthRecords.findById(id)

    if (!healthRecord) {
      throw new RecordsNotExistsError()
    }

    await this.healthRecords.delete(id)
  }
}
