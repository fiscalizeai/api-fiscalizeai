import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeDeleteUseCase } from '@/use-cases/factories/tranport-records/make-delete-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteTransportRecord(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    transportId: z.string().uuid(),
  })

  const { transportId } = deleteParamsSchema.parse(request.params)

  try {
    const deleteUseCase = makeDeleteUseCase()

    await deleteUseCase.execute({
      id: transportId,
    })
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}
