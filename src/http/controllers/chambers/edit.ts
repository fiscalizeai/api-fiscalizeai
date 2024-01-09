import { ChamberAlreadyExistsError } from '@/use-cases/errors/chambers/chamber-already-exists'
import { makeEditUseCase } from '@/use-cases/factories/chambers/make-edit-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editChamberParamsSchema = z.object({
    chamberId: z.string().cuid(),
  })

  const editChamberBodySchema = z.object({
    data: z.object({
      name: z.string(),
      state: z.string(),
    }),
  })

  const { chamberId } = editChamberParamsSchema.parse(request.params)
  const { data } = editChamberBodySchema.parse(request.body)

  try {
    const editChamberUseCase = makeEditUseCase()

    await editChamberUseCase.execute({
      id: chamberId,
      data,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ChamberAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
