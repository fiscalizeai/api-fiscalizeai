import { HealthRecordsRepository } from '@/repositories/health'
import { Health } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface FetchHealthRecordsUseCaseRequest {
  page: number
  chamberId: string
  items: number
  date?: Date
}

interface FetchHealthRecordsUseCaseResponse {
  healthRecords: Health[]
}

export class FetchHealthRecordsUseCase {
  constructor(private healthRepository: HealthRecordsRepository) {}

  async execute({
    page,
    chamberId,
    items,
    date,
  }: FetchHealthRecordsUseCaseRequest): Promise<FetchHealthRecordsUseCaseResponse> {
    const healthRecords = await this.healthRepository.fetch(
      page,
      chamberId,
      items,
      date,
    )

    if (!healthRecords) {
      throw new ResouceNotFoundError()
    }

    return {
      healthRecords,
    }
  }
}
