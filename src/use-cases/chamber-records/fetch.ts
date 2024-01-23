import { ChamberRecordsRepository } from '@/repositories/chamber'
import { Chamber } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface FetchChamberRecordsUseCaseRequest {
  page: number
  cityId: string
  items: number
  month?: number
  year?: number
}

interface FetchChamberRecordsUseCaseResponse {
  chamber: Chamber[]
  pagination: {
    totalItems: number
    pageSize: number
    pageNumber: number
    pageItems: number
  }
}

export class FetchChamberRecordsUseCase {
  constructor(private chamberRepository: ChamberRecordsRepository) {}

  async execute({
    page,
    cityId,
    items,
    month,
    year,
  }: FetchChamberRecordsUseCaseRequest): Promise<FetchChamberRecordsUseCaseResponse> {
    const chamberRecords = await this.chamberRepository.fetch(
      page,
      cityId,
      items,
      month,
      year,
    )

    if (!chamberRecords) {
      throw new ResourceNotFoundError()
    }

    const { chamber, pagination } = chamberRecords

    return {
      chamber,
      pagination,
    }
  }
}
