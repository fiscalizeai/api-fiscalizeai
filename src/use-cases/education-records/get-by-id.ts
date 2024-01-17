import { Education } from '@prisma/client'
import { EducationRecordsRepository } from '@/repositories/education'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface GetEducationRecordByIdUseCaseRequest {
  id: string
}

interface GetEducationRecordByIdCaseResponse {
  educationRecord: Education | null
}

export class GetEducationRecordByIdUseCase {
  constructor(private educationRecordsRepository: EducationRecordsRepository) {}

  async execute({
    id,
  }: GetEducationRecordByIdUseCaseRequest): Promise<GetEducationRecordByIdCaseResponse> {
    const educationRecord = await this.educationRecordsRepository.findById(id)

    if (!educationRecord) {
      throw new RecordsNotExistsError()
    }

    return {
      educationRecord,
    }
  }
}
