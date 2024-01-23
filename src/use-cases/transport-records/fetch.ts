import { Transport } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { TransportRecordsRepository } from '@/repositories/transport'

interface FetchTransportRecordsUseCaseRequest {
  page: number
  cityId: string
  items: number
  month?: number
  year?: number
}

interface FetchTransportRecordsUseCaseResponse {
  transport: Transport[]
  pagination: {
    totalItems: number
    pageSize: number
    pageNumber: number
    pageItems: number
  }
}

export class FetchTransportRecordsUseCase {
  constructor(private transportRecords: TransportRecordsRepository) {}

  async execute({
    page,
    cityId,
    items,
    month,
    year,
  }: FetchTransportRecordsUseCaseRequest): Promise<FetchTransportRecordsUseCaseResponse> {
    const transportRecords = await this.transportRecords.fetch(
      page,
      cityId,
      items,
      month,
      year,
    )

    if (!transportRecords) {
      throw new ResourceNotFoundError()
    }

    const { transport, pagination } = transportRecords

    return {
      transport,
      pagination,
    }
  }
}
