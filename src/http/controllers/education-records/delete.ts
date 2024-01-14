import { EducationRecordsNotExistsError } from '@/use-cases/errors/education/education-not-exists'
import { makeDeleteUseCase } from '@/use-cases/factories/education-records/make-delete-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteEducationRecord(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    educationId: z.string().uuid(),
  })

  const { educationId } = deleteParamsSchema.parse(request.params)

  try {
    const deleteUseCase = makeDeleteUseCase()

    await deleteUseCase.execute({
      id: educationId,
    })
  } catch (error) {
    if (error instanceof EducationRecordsNotExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}
