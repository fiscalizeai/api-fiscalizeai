import { ChamberRecordsRepository } from '@/repositories/chamber'
import { Chamber, Prisma } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidDateError } from '../errors/records/invalid-date'

interface EditChamberRecordUseCaseRequest {
  id: string
  data: Prisma.ChamberUncheckedUpdateInput
}

interface EditChamberRecordUseCaseResponse {
  chamberRecordEdited: Chamber | null
}

export class EditChamberRecordUseCase {
  constructor(private chamberRecordRepository: ChamberRecordsRepository) {}

  async execute({
    id,
    data,
  }: EditChamberRecordUseCaseRequest): Promise<EditChamberRecordUseCaseResponse> {
    const chamberRecord = await this.chamberRecordRepository.findById(id)

    if (!chamberRecord) {
      throw new RecordsNotExistsError()
    }

    const { month, year } = data

    let existingChamberRecordInMonth

    if (month && year) {
      const dateForVerification = new Date()

      if (
        Number(month) >= dateForVerification.getMonth() &&
        Number(year) > dateForVerification.getFullYear()
      ) {
        throw new InvalidDateError()
      }

      existingChamberRecordInMonth =
        await this.chamberRecordRepository.findByMonthAndYear(
          month,
          year,
          chamberRecord.city_id,
        )
    }

    if (
      existingChamberRecordInMonth &&
      existingChamberRecordInMonth.id !== id
    ) {
      throw new RecordsAlreadyExistsError()
    }

    const chamberRecordEdited = await this.chamberRecordRepository.edit(
      id,
      data,
    )

    return {
      chamberRecordEdited,
    }
  }
}
