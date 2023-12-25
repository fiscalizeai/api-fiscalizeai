import { makeFetchByChamberUseCase } from '@/use-cases/factories/users/make-fetch-by-chamber-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchByChamber(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchByChamberQuerySchema = z.object({
    city: z.string(),
    state: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { city, state, page } = fetchByChamberQuerySchema.parse(request.query)

  const fetchUsersByChamberUseCase = makeFetchByChamberUseCase()

  const { users } = await fetchUsersByChamberUseCase.execute({
    city,
    state,
    page,
  })

  return reply.status(200).send({
    users,
  })
}
