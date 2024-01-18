import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeGetByIdUseCase } from '@/use-cases/factories/health-records/make-get-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getByIdParamsSchema = z.object({
    healthId: z.string(),
  })

  const { healthId } = getByIdParamsSchema.parse(request.params)

  try {
    const health = makeGetByIdUseCase()

    const { healthRecord } = await health.execute({
      id: healthId,
    })

    return reply.status(200).send({
      healthRecord,
    })
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
