import { EducationRecordsRepository } from '@/repositories/education'
import { EducationRecordsNotExistsError } from '../errors/education/education-not-exists'

interface DeleteEducationRecordUseCaseRequest {
  id: string
}

export class DeleteEducationRecordUseCase {
  constructor(private educationRecords: EducationRecordsRepository) {}

  async execute({ id }: DeleteEducationRecordUseCaseRequest): Promise<void> {
    const educationRecord = await this.educationRecords.findById(id)

    if (!educationRecord) {
      throw new EducationRecordsNotExistsError()
    }

    await this.educationRecords.delete(id)
  }
}
