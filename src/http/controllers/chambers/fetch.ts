import { makeFetchUseCase } from '@/use-cases/factories/chambers/make-fetch-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    state: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { state, page } = fetchQuerySchema.parse(request.query)

  const fetchUseCase = makeFetchUseCase()

  const { chambers } = await fetchUseCase.execute({
    state,
    page,
  })

  return reply.status(200).send({
    chambers,
  })
}
