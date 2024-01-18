import { PersonRecordsRepository } from '@/repositories/person'
import { Person, Prisma } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'

interface EditPersonRecordUseCaseRequest {
  id: string
  data: Prisma.PersonUncheckedUpdateInput
}

interface EditPersonRecordUseCaseResponse {
  personRecordEdited: Person | null
}

export class EditPersonRecordUseCase {
  constructor(private personRecordRepository: PersonRecordsRepository) {}

  async execute({
    id,
    data,
  }: EditPersonRecordUseCaseRequest): Promise<EditPersonRecordUseCaseResponse> {
    const personRecord = await this.personRecordRepository.findById(id)

    if (!personRecord) {
      throw new RecordsNotExistsError()
    }

    const { month } = data

    let existingPersonRecordInMonth

    if (month) {
      const date = new Date(month.toString())

      existingPersonRecordInMonth =
        await this.personRecordRepository.findByMonthAndYear(date)
    }

    if (existingPersonRecordInMonth && existingPersonRecordInMonth.id !== id) {
      throw new RecordsAlreadyExistsError()
    }

    const personRecordEdited = await this.personRecordRepository.edit(id, data)

    return {
      personRecordEdited,
    }
  }
}
