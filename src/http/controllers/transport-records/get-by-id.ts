import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeGetByIdUseCase } from '@/use-cases/factories/tranport-records/make-get-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getByIdParamsSchema = z.object({
    transportId: z.string(),
  })

  const { transportId } = getByIdParamsSchema.parse(request.params)

  try {
    const transport = makeGetByIdUseCase()

    const { transportRecord } = await transport.execute({
      id: transportId,
    })

    return reply.status(200).send({
      transportRecord,
    })
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
