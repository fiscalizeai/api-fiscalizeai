import { Prisma, Transport } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { TransportRecordsRepository } from '@/repositories/transport'

interface EditTransportRecordUseCaseRequest {
  id: string
  data: Prisma.TransportUncheckedUpdateInput
}

interface EditTransportRecordUseCaseResponse {
  transportRecordEdited: Transport | null
}

export class EditTransportRecordUseCase {
  constructor(private transportRecordRepository: TransportRecordsRepository) {}

  async execute({
    id,
    data,
  }: EditTransportRecordUseCaseRequest): Promise<EditTransportRecordUseCaseResponse> {
    const educationRecord = await this.transportRecordRepository.findById(id)

    if (!educationRecord) {
      throw new RecordsNotExistsError()
    }

    const { month, year } = data

    let existingEducationRecordInMonth

    if (month && year) {
      existingEducationRecordInMonth =
        await this.transportRecordRepository.findByMonthAndYear(month, year)
    }

    if (
      existingEducationRecordInMonth &&
      existingEducationRecordInMonth.id !== id
    ) {
      throw new RecordsAlreadyExistsError()
    }

    const transportRecordEdited = await this.transportRecordRepository.edit(
      id,
      data,
    )

    return {
      transportRecordEdited,
    }
  }
}
