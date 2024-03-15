import { EducationRecordsRepository } from '@/repositories/education'
import { Education, Prisma } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidDateError } from '../errors/records/invalid-date'

interface EditEducationRecordUseCaseRequest {
  id: string
  data: Prisma.EducationUncheckedUpdateInput
}

interface EditEducationRecordUseCaseResponse {
  educationRecordEdited: Education | null
}

export class EditEducationRecordUseCase {
  constructor(private educationRecordRepository: EducationRecordsRepository) {}

  async execute({
    id,
    data,
  }: EditEducationRecordUseCaseRequest): Promise<EditEducationRecordUseCaseResponse> {
    const educationRecord = await this.educationRecordRepository.findById(id)

    if (!educationRecord) {
      throw new RecordsNotExistsError()
    }

    const { month, year } = data

    let existingEducationRecordInMonth

    if (month && year) {
      const dateForVerification = new Date()

      if (
        Number(month) >= dateForVerification.getMonth() &&
        Number(year) > dateForVerification.getFullYear()
      ) {
        throw new InvalidDateError()
      }

      existingEducationRecordInMonth =
        await this.educationRecordRepository.findByMonthAndYear(
          month,
          year,
          educationRecord.city_id,
        )
    }

    if (
      existingEducationRecordInMonth &&
      existingEducationRecordInMonth.id !== id
    ) {
      throw new RecordsAlreadyExistsError()
    }

    const educationRecordEdited = await this.educationRecordRepository.edit(
      id,
      data,
    )

    return {
      educationRecordEdited,
    }
  }
}
