import { makeEditUseCase } from '@/use-cases/factories/users/make-edit-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const Status = ['ACCEPTED', 'DENIED'] as const
const Role = ['ADMIN', 'MEMBER', 'SECRETARY'] as const

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editUserParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const editUserBodySchema = z.object({
    data: z.object({
      name: z.string().optional(),
      cpf: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
      status: z.enum(Status).optional(),
      role: z.enum(Role).optional(),
    }),
  })

  const { userId } = editUserParamsSchema.parse(request.params)
  const { data } = editUserBodySchema.parse(request.body)

  const editUserUseCase = makeEditUseCase()

  await editUserUseCase.execute({
    userId,
    data,
  })

  return reply.status(204).send()
}
