import { Health } from '@prisma/client'
import { HealthRecordsRepository } from '@/repositories/health'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface GetHealthRecordByIdUseCaseRequest {
  id: string
}

interface GetHealthRecordByIdCaseResponse {
  healthRecord: Health | null
}

export class GetHealthRecordByIdUseCase {
  constructor(private healthRecordsRepository: HealthRecordsRepository) {}

  async execute({
    id,
  }: GetHealthRecordByIdUseCaseRequest): Promise<GetHealthRecordByIdCaseResponse> {
    const healthRecord = await this.healthRecordsRepository.findById(id)

    if (!healthRecord) {
      throw new RecordsNotExistsError()
    }

    return {
      healthRecord,
    }
  }
}
