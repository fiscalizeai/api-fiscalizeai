import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeDeleteUseCase } from '@/use-cases/factories/person-records/make-delete-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deletePersonRecord(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    personId: z.string().uuid(),
  })

  const { personId } = deleteParamsSchema.parse(request.params)

  try {
    const deleteUseCase = makeDeleteUseCase()

    await deleteUseCase.execute({
      id: personId,
    })
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}
