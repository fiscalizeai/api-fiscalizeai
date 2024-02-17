import { HealthRecordsRepository } from '@/repositories/health'
import { Health } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface FetchHealthRecordsUseCaseRequest {
  page: number
  cityId: string
  items: number
  month?: number
  year?: number
}

interface FetchHealthRecordsUseCaseResponse {
  health: Health[]
  pagination: {
    totalItems: number
    pageSize: number
    pageNumber: number
    pageItems: number
  }
}

export class FetchHealthRecordsUseCase {
  constructor(private healthRepository: HealthRecordsRepository) {}

  async execute({
    page,
    cityId,
    items,
    month,
    year,
  }: FetchHealthRecordsUseCaseRequest): Promise<FetchHealthRecordsUseCaseResponse> {
    const healthRecords = await this.healthRepository.fetch(
      page,
      cityId,
      items,
      month,
      year,
    )

    if (!healthRecords) {
      throw new RecordsNotExistsError()
    }

    const { health, pagination } = healthRecords

    return {
      health,
      pagination,
    }
  }
}
