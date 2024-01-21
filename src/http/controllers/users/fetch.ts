import { makeFetchUseCase } from '@/use-cases/factories/users/make-fetch-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const roleEnum = ['ADMIN', 'SECRETARY', 'MEMBER'] as const
const statusEnum = ['ACCEPTED', 'DENIED'] as const

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    items: z.coerce.number().default(20),
    state: z.string().max(2).optional(),
    city: z.string().optional(),
    name: z.string().optional(),
    cpf: z.string().optional(),
    role: z.enum(roleEnum).optional(),
    status: z.enum(statusEnum).optional(),
  })

  const { page, items, city, name, status, role, state } =
    fetchQuerySchema.parse(request.query)

  const fetchUsersUseCase = makeFetchUseCase()

  const { users, pagination } = await fetchUsersUseCase.execute({
    page,
    items,
    city,
    name,
    status,
    role,
    state,
  })

  return reply.status(200).send({
    users,
    pagination,
  })
}
