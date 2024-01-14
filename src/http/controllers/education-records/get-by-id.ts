import { EducationRecordsNotExistsError } from '@/use-cases/errors/education/education-not-exists'
import { makeGetByIdUseCase } from '@/use-cases/factories/education-records/make-get-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getByIdQuerySchema = z.object({
    educationId: z.string(),
  })

  const { educationId } = getByIdQuerySchema.parse(request.query)

  try {
    const getUserInfo = makeGetByIdUseCase()

    const { educationRecord } = await getUserInfo.execute({
      id: educationId,
    })

    return reply.status(200).send({
      educationRecord,
    })
  } catch (error) {
    if (error instanceof EducationRecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
