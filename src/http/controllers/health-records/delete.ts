import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeDeleteUseCase } from '@/use-cases/factories/health-records/make-delete-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteHealthRecord(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    healthId: z.string().uuid(),
  })

  const { healthId } = deleteParamsSchema.parse(request.params)

  try {
    const deleteUseCase = makeDeleteUseCase()

    await deleteUseCase.execute({
      id: healthId, // Troquei de "chamberId" para "healthId"
    })
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}
