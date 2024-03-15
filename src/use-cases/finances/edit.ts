import { FinancesRepository } from '@/repositories/finance'
import { Finance, Prisma } from '@prisma/client'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidDateError } from '../errors/records/invalid-date'

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
      const dateForVerification = new Date()

      if (
        Number(month) >= dateForVerification.getMonth() &&
        Number(year) > dateForVerification.getFullYear()
      ) {
        throw new InvalidDateError()
      }

      existingFinanceInMonth = await this.financeRepository.findByMonthAndYear(
        month,
        year,
        finance.city_id,
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
