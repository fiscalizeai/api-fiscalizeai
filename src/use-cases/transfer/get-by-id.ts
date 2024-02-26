import { TransferRepository } from '@/repositories/transfer'
import { Transfer } from '@prisma/client'
import { TransferNotFoundError } from '../errors/records/transfer-not-found'

interface GetTransferByIdUseCaseRequest {
  id: string
}

interface GetTransferByIdUseCaseResponse {
  transfer: Transfer | null
}

export class GetTransferByIdUseCase {
  constructor(private transfersRepository: TransferRepository) {}

  async execute({
    id,
  }: GetTransferByIdUseCaseRequest): Promise<GetTransferByIdUseCaseResponse> {
    const transfer = await this.transfersRepository.findById(id)

    if (!transfer) {
      throw new TransferNotFoundError()
    }

    return {
      transfer,
    }
  }
}
