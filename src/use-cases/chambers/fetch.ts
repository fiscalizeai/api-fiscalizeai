import { Chamber } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { ChambersRepository } from '@/repositories/chambers'

interface FetchUseCaseRequest {
  page: number
  items?: number
  name?: string
  state?: string
}

interface FetchUseCaseResponse {
  chambers: Chamber[]
}

export class FetchUseCase {
  constructor(private chamberRepository: ChambersRepository) {}

  async execute({
    page,
    items,
    name,
    state,
  }: FetchUseCaseRequest): Promise<FetchUseCaseResponse> {
    const params: { [key: string]: string | undefined } = {
      name,
      state,
    }

    // Remove chaves cujos valores sao undefined
    // Para evitar filtragem por campos nao fornecidos
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key],
    )

    const chambers = await this.chamberRepository.fetch(page, items, params)

    if (!chambers) {
      throw new ResouceNotFoundError() // TODO: Switch this error for correctly error.
    }

    return {
      chambers,
    }
  }
}
