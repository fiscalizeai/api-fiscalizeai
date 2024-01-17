import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { TransportRecordsRepository } from '@/repositories/transport'

interface DeleteTransportRecordUseCaseRequest {
  id: string
}

export class DeleteTransportRecordUseCase {
  constructor(private transportRecords: TransportRecordsRepository) {}

  async execute({ id }: DeleteTransportRecordUseCaseRequest): Promise<void> {
    const transportRecord = await this.transportRecords.findById(id)

    if (!transportRecord) {
      throw new RecordsNotExistsError()
    }

    await this.transportRecords.delete(id)
  }
}
