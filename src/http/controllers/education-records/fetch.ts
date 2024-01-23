import { makeFetchUseCase } from '@/use-cases/factories/education-records/make-fetch-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    items: z.coerce.number().default(20),
    month: z.coerce.number().optional(),
    year: z.coerce.number().optional(),
  })

  const { page, items, month, year } = fetchQuerySchema.parse(request.query)

  const { city } = request.user

  const fetchUseCase = makeFetchUseCase()

  const { education, pagination } = await fetchUseCase.execute({
    page,
    cityId: city,
    items,
    month,
    year,
  })

  return reply.status(200).send({
    education,
    pagination,
  })
}
