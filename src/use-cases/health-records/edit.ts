import { HealthRecordsRepository } from '@/repositories/health'
import { Health, Prisma } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'

interface EditHealthRecordUseCaseRequest {
  id: string
  data: Prisma.HealthUncheckedUpdateInput
}

interface EditHealthRecordUseCaseResponse {
  healthRecordEdited: Health | null
}

export class EditHealthRecordUseCase {
  constructor(private healthRecordRepository: HealthRecordsRepository) {}

  async execute({
    id,
    data,
  }: EditHealthRecordUseCaseRequest): Promise<EditHealthRecordUseCaseResponse> {
    const healthRecord = await this.healthRecordRepository.findById(id)

    if (!healthRecord) {
      throw new RecordsNotExistsError()
    }

    const { month, year } = data

    let existingHealthRecordInMonth

    if (month && year) {
      existingHealthRecordInMonth =
        await this.healthRecordRepository.findByMonthAndYear(month, year)
    }

    if (existingHealthRecordInMonth && existingHealthRecordInMonth.id !== id) {
      throw new RecordsAlreadyExistsError()
    }

    const healthRecordEdited = await this.healthRecordRepository.edit(id, data)

    return {
      healthRecordEdited,
    }
  }
}
