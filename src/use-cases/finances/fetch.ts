import { FinancesRepository } from '@/repositories/finance'
import { Finance } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface FetchFinancesUseCaseRequest {
  page: number
  cityId: string
  items: number
  month?: number
  year?: number
}

interface FetchFinancesUseCaseRespose {
  finances: Finance[]
  pagination: {
    totalItems: number
    pageSize: number
    pageNumber: number
    pageItems: number
  }
}

export class FetchFinancesUseCase {
  constructor(private financesRepository: FinancesRepository) {}

  async execute({
    page,
    cityId,
    items,
    month,
    year,
  }: FetchFinancesUseCaseRequest): Promise<FetchFinancesUseCaseRespose> {
    const financesResponse = await this.financesRepository.fetch(
      page,
      cityId,
      items,
      month,
      year,
    )

    if (!financesResponse) {
      throw new RecordsNotExistsError()
    }

    const { finances, pagination } = financesResponse

    return {
      finances,
      pagination,
    }
  }
}
