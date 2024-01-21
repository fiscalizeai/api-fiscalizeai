import { PersonRecordsRepository } from '@/repositories/person'
import { Person } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface FetchPersonRecordsUseCaseRequest {
  page: number
  cityId: string
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
    cityId,
    items,
    date,
  }: FetchPersonRecordsUseCaseRequest): Promise<FetchPersonRecordsUseCaseResponse> {
    const personRecords = await this.personRepository.fetch(
      page,
      cityId,
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
