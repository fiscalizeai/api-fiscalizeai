import { TransferRepository } from '@/repositories/transfer'
import { Transfer } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

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
      throw new ResourceNotFoundError()
    }

    return {
      transfer,
    }
  }
}
