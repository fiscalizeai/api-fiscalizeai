import { ChamberAssociatedUsers } from '@/use-cases/errors/chambers/chamber-associated-users'
import { ChamberNotFoundError } from '@/use-cases/errors/chambers/chamber-not-found'
import { makeDeleteUseCase } from '@/use-cases/factories/chambers/make-delete-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteChamber(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    chamberId: z.string().cuid(),
  })

  const { chamberId } = deleteParamsSchema.parse(request.params)

  try {
    const deleteUseCase = makeDeleteUseCase()

    await deleteUseCase.execute({
      id: chamberId,
    })
  } catch (error) {
    if (error instanceof ChamberNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof ChamberAssociatedUsers) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}
