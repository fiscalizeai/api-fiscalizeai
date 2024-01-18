import { PersonRecordsRepository } from '@/repositories/person'
import { Person } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface FetchPersonRecordsUseCaseRequest {
  page: number
  chamberId: string
  items: number
  date?: Date
}

interface FetchPersonRecordsUseCaseResponse {
  personRecords: Person[]
}

export class FetchPersonRecordsUseCase {
  constructor(private personRepository: PersonRecordsRepository) {}

  async execute({
    page,
    chamberId,
    items,
    date,
  }: FetchPersonRecordsUseCaseRequest): Promise<FetchPersonRecordsUseCaseResponse> {
    const personRecords = await this.personRepository.fetch(
      page,
      chamberId,
      items,
      date,
    )

    if (!personRecords) {
      throw new ResouceNotFoundError()
    }

    return {
      personRecords,
    }
  }
}
