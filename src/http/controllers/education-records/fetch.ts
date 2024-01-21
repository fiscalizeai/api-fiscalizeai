import { makeFetchUseCase } from '@/use-cases/factories/education-records/make-fetch-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    items: z.coerce.number().default(20),
    date: z.coerce.date().optional(),
  })

  const { page, items, date } = fetchQuerySchema.parse(request.query)

  const { city } = request.user

  const fetchUseCase = makeFetchUseCase()

  const { education, pagination } = await fetchUseCase.execute({
    page,
    cityId: city,
    items,
    date,
  })

  return reply.status(200).send({
    education,
    pagination,
  })
}
