import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeGetByIdUseCase } from '@/use-cases/factories/person-records/make-get-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getByIdParamsSchema = z.object({
    personId: z.string(),
  })

  const { personId } = getByIdParamsSchema.parse(request.params)

  try {
    const person = makeGetByIdUseCase()

    const { personRecord } = await person.execute({
      id: personId,
    })

    return reply.status(200).send({
      personRecord,
    })
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
