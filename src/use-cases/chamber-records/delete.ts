import { ChamberRecordsRepository } from '@/repositories/chamber'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface DeleteChamberRecordUseCaseRequest {
  id: string
}

export class DeleteChamberRecordUseCase {
  constructor(private chamberRecords: ChamberRecordsRepository) {}

  async execute({ id }: DeleteChamberRecordUseCaseRequest): Promise<void> {
    const chamberRecord = await this.chamberRecords.findById(id)

    if (!chamberRecord) {
      throw new RecordsNotExistsError()
    }

    await this.chamberRecords.delete(id)
  }
}
