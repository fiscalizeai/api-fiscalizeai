import { Transport } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { TransportRecordsRepository } from '@/repositories/transport'

interface FetchTransportRecordsUseCaseRequest {
  page: number
  chamberId: string
  items: number
  date?: Date
}

interface FetchTransportRecordsUseCaseResponse {
  transportRecords: Transport[]
}

export class FetchTransportRecordsUseCase {
  constructor(private transportRecords: TransportRecordsRepository) {}

  async execute({
    page,
    chamberId,
    items,
    date,
  }: FetchTransportRecordsUseCaseRequest): Promise<FetchTransportRecordsUseCaseResponse> {
    const transportRecords = await this.transportRecords.fetch(
      page,
      chamberId,
      items,
      date,
    )

    if (!transportRecords) {
      throw new ResouceNotFoundError()
    }

    return {
      transportRecords,
    }
  }
}
