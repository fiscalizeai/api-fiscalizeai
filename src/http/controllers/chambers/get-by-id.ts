import { ChamberNotFoundError } from '@/use-cases/errors/chambers/chamber-not-found'
import { makeGetByIdUseCase } from '@/use-cases/factories/chambers/make-get-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getByIdParamsSchema = z.object({
    chamberId: z.string(),
  })

  const { chamberId } = getByIdParamsSchema.parse(request.params)

  try {
    const chamberById = makeGetByIdUseCase()

    const { chamber, usersCount, users } = await chamberById.execute({
      id: chamberId,
    })

    return reply.status(200).send({
      chamber,
      usersCount,
      users,
    })
  } catch (error) {
    if (error instanceof ChamberNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
