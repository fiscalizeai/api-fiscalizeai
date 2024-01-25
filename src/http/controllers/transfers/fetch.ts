import { makeFetchUseCase } from '@/use-cases/factories/transfers/make-fetch-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    items: z.coerce.number().default(20),
    demonstrative: z.string().optional(),
  })

  const { page, items, demonstrative } = fetchQuerySchema.parse(request.query)

  const { city } = request.user

  const fetchUseCase = makeFetchUseCase()

  const { transfers, pagination } = await fetchUseCase.execute({
    page,
    cityId: city,
    items,
    demonstrative,
  })

  return reply.status(200).send({
    transfers,
    pagination,
  })
}
