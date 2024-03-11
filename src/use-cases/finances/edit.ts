import { FinancesRepository } from '@/repositories/finance'
import { Finance, Prisma } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'

interface EditFinanceUseCaseRequest {
  id: string
  data: Prisma.FinanceUncheckedUpdateInput
}

interface EditFinanceUseCaseRespose {
  financeEdited: Finance | null
}

export class EditFinanceUseCase {
  constructor(private financeRepository: FinancesRepository) {}

  async execute({
    id,
    data,
  }: EditFinanceUseCaseRequest): Promise<EditFinanceUseCaseRespose> {
    const finance = await this.financeRepository.findById(id)

    if (!finance) {
      throw new RecordsNotExistsError()
    }

    const { month, year } = data

    let existingFinanceInMonth

    if (month && year) {
      existingFinanceInMonth = await this.financeRepository.findByMonthAndYear(
        month,
        year,
      )
    }

    if (existingFinanceInMonth && existingFinanceInMonth.id !== id) {
      throw new RecordsAlreadyExistsError()
    }

    const financeEdited = await this.financeRepository.edit(id, data)

    return {
      financeEdited,
    }
  }
}
