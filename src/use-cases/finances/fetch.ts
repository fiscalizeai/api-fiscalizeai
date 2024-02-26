import { FinancesRepository } from '@/repositories/finance'
import { n } from 'vitest/dist/reporters-LLiOBu3g'

interface FetchFinancesUseCaseRequest {
  page: number
  cityId: string
  items: number
  month?: number
  year?: number
}

interface Finance {
  id: string
  finance_id: string
  iptu: number
  iss: number
  itbi: number
  month: number
  year: number
  created_at: string
  updated_at: string
  value: string
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

    const { finances, pagination } = financesResponse

    return {
      finances,
      pagination,
    }
  }
}
