import { FinancesRepository } from '@/repositories/finance'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

interface DeleteFinanceUseCaseRequest {
  id: string
}

export class DeleteFinanceUseCase {
  constructor(private financesRepository: FinancesRepository) {}

  async execute({ id }: DeleteFinanceUseCaseRequest): Promise<void> {
    const finance = await this.financesRepository.findById(id)

    if (!finance) {
      throw new RecordsNotExistsError()
    }

    await this.financesRepository.delete(id)
  }
}
