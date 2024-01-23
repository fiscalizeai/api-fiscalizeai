import { Chamber } from '@prisma/client'
import { ChamberRecordsRepository } from '@/repositories/chamber'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface GetChamberRecordByIdUseCaseRequest {
  id: string
}

interface GetChamberRecordByIdCaseResponse {
  chamberRecord: Chamber | null
}

export class GetChamberRecordByIdUseCase {
  constructor(private chamberRecordsRepository: ChamberRecordsRepository) {}

  async execute({
    id,
  }: GetChamberRecordByIdUseCaseRequest): Promise<GetChamberRecordByIdCaseResponse> {
    const chamberRecord = await this.chamberRecordsRepository.findById(id)

    if (!chamberRecord) {
      throw new RecordsNotExistsError()
    }

    return {
      chamberRecord,
    }
  }
}
