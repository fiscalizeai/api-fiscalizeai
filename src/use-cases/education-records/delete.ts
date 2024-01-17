import { EducationRecordsRepository } from '@/repositories/education'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface DeleteEducationRecordUseCaseRequest {
  id: string
}

export class DeleteEducationRecordUseCase {
  constructor(private educationRecords: EducationRecordsRepository) {}

  async execute({ id }: DeleteEducationRecordUseCaseRequest): Promise<void> {
    const educationRecord = await this.educationRecords.findById(id)

    if (!educationRecord) {
      throw new RecordsNotExistsError()
    }

    await this.educationRecords.delete(id)
  }
}
