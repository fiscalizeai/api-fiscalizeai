import { ResouceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeDeleteUseCase } from '@/use-cases/factories/users/make-delete-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const deleteParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const { userId } = deleteParamsSchema.parse(request.params)

  try {
    const deleteUseCase = makeDeleteUseCase()

    await deleteUseCase.execute({
      id: userId,
    })
  } catch (err) {
    if (err instanceof ResouceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(204).send()
}
