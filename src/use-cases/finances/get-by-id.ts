import { FinancesRepository } from '@/repositories/finance'
import { TransferRepository } from '@/repositories/transfer'
import { Finance } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface GetFinanceByIdUseCaseRequest {
  id: string
}

interface GetFinanceByIdUseCaseResponse {
  finance: Finance | null
  totalTransfers: number
  totalFinance: number
  total: number
}

export class GetFinanceByIdUseCase {
  constructor(
    private financesRepository: FinancesRepository,
    private transferRepository: TransferRepository,
  ) {}

  async execute({
    id,
  }: GetFinanceByIdUseCaseRequest): Promise<GetFinanceByIdUseCaseResponse> {
    const finance = await this.financesRepository.findById(id)

    if (!finance) {
      throw new RecordsNotExistsError()
    }

    const { city_id, month, year, iptu, iss, itbi } = finance

    const currentMonth = new Date(`${year}-${month}-01`)

    const sumTransfers = await this.transferRepository.totalTransferByMonth(
      currentMonth,
      city_id,
    )

    const sumFinance = iptu + iss + itbi
    const sumTotal = sumFinance + sumTransfers

    return {
      finance,
      totalTransfers: sumTransfers,
      totalFinance: sumFinance,
      total: sumTotal,
    }
  }
}
