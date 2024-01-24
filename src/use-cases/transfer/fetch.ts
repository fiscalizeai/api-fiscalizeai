import { TransferRepository } from '@/repositories/transfer'
import { Transfer } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface FetchTransferUseCaseRequest {
  page: number
  cityId: string
  items: number
  demonstrative?: string
}

interface FetchTransferUseCaseResponse {
  transfers: Transfer[]
  pagination: {
    totalItems: number
    pageSize: number
    pageNumber: number
    pageItems: number
  }
}

export class FetchTransferUseCase {
  constructor(private transferRepository: TransferRepository) {}

  async execute({
    page,
    cityId,
    items,
    demonstrative,
  }: FetchTransferUseCaseRequest): Promise<FetchTransferUseCaseResponse> {
    const params: { [key: string]: string | undefined } = {
      demonstrative,
    }

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key],
    )

    const transferReturn = await this.transferRepository.fetch(
      page,
      cityId,
      items,
      params,
    )

    if (!transferReturn) {
      throw new ResourceNotFoundError()
    }

    const { transfers, pagination } = transferReturn

    return {
      transfers,
      pagination,
    }
  }
}
