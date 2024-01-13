import { EducationRecordsRepository } from '@/repositories/education'
import { Education, Prisma } from '@prisma/client'
import { parseISO } from 'date-fns'
import { EducationRecordsNotExistsError } from '../errors/education/education-not-exists'
import { EducationRecordsAlreadyExistsError } from '../errors/education/education-record-already-exists'

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
      throw new EducationRecordsNotExistsError()
    }

    const { month } = data

    let existingEducationRecordInMonth

    if (month) {
      const date = new Date(month.toString())

      existingEducationRecordInMonth =
        await this.educationRecordRepository.findByMonthAndYear(date)
    }

    console.log(existingEducationRecordInMonth, 'dupli')

    if (
      existingEducationRecordInMonth &&
      existingEducationRecordInMonth.id !== id
    ) {
      throw new EducationRecordsAlreadyExistsError()
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
