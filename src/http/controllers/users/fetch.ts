import { makeFetchUseCase } from '@/use-cases/factories/users/make-fetch-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = fetchQuerySchema.parse(request.query)

  const fetchUsersUseCase = makeFetchUseCase()

  const { users } = await fetchUsersUseCase.execute({
    page,
  })

  return reply.status(200).send({
    users,
  })
}
