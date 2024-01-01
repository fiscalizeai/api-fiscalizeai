import { makeFetchByStateUseCase } from '@/use-cases/factories/chambers/make-fetch-by-state-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchByState(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchQuerySchema = z.object({
    state: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { state, page } = fetchQuerySchema.parse(request.query)

  const fetchUseCase = makeFetchByStateUseCase()

  const { chambers } = await fetchUseCase.execute({
    state,
    page,
  })

  return reply.status(200).send({
    chambers,
  })
}
