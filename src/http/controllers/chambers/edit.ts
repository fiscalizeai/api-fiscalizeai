import { makeEditUseCase } from '@/use-cases/factories/chambers/make-edit-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editChamberParamsSchema = z.object({
    chamberId: z.string().cuid(),
  })

  const editChamberBodySchema = z.object({
    data: z.object({
      name: z.string().optional(),
      state: z.string().optional(),
    }),
  })

  const { chamberId } = editChamberParamsSchema.parse(request.params)
  const { data } = editChamberBodySchema.parse(request.body)

  const editChamberUseCase = makeEditUseCase()

  await editChamberUseCase.execute({
    id: chamberId,
    data,
  })

  return reply.status(204).send()
}
