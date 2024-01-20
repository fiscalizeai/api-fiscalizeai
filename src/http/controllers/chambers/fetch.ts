import { makeFetchUseCase } from '@/use-cases/factories/chambers/make-fetch-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    items: z.coerce.number().default(20),
    name: z.string().optional(),
    state: z.string().optional(),
  })

  const { page, items, name, state } = fetchQuerySchema.parse(request.query)

  const fetchUseCase = makeFetchUseCase()

  const { chambers, pagination } = await fetchUseCase.execute({
    page,
    items,
    name,
    state,
  })

  return reply.status(200).send({
    chambers,
    pagination,
  })
}
