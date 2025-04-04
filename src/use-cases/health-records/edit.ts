import { HealthRecordsRepository } from '@/repositories/health'
import { Health, Prisma } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidDateError } from '../errors/records/invalid-date'

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
      const dateForVerification = new Date()

      if (
        Number(month) >= dateForVerification.getMonth() &&
        Number(year) > dateForVerification.getFullYear()
      ) {
        throw new InvalidDateError()
      }

      existingHealthRecordInMonth =
        await this.healthRecordRepository.findByMonthAndYear(
          month,
          year,
          healthRecord.city_id,
        )
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
