import { makeSearchByNameUseCase } from '@/use-cases/factories/users/make-search-by-name-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchByName(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchByNameQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchByNameQuerySchema.parse(request.query)

  const searchUsersByNameUseCase = makeSearchByNameUseCase()

  const { users } = await searchUsersByNameUseCase.execute({
    query,
    page,
  })

  return reply.status(200).send({
    users,
  })
}
