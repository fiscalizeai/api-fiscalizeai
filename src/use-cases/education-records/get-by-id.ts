import { Transport } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { TransportRecordsRepository } from '@/repositories/transport'

interface GetTransportRecordByIdUseCaseRequest {
  id: string
}

interface GetTransportRecordByIdCaseResponse {
  transportRecord: Transport | null
}

export class GetTransportRecordByIdUseCase {
  constructor(private transportRecordsRepository: TransportRecordsRepository) {}

  async execute({
    id,
  }: GetTransportRecordByIdUseCaseRequest): Promise<GetTransportRecordByIdCaseResponse> {
    const transportRecord = await this.transportRecordsRepository.findById(id)

    if (!transportRecord) {
      throw new RecordsNotExistsError()
    }

    return {
      transportRecord,
    }
  }
}
