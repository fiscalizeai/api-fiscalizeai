import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeGetByIdUseCase } from '@/use-cases/factories/chamber-records/make-get-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  // Definindo o esquema de validação para os parametros
  const getByIdParamsSchema = z.object({
    chamberId: z.string(),
  })

  const { chamberId } = getByIdParamsSchema.parse(request.params)

  try {
    const chamber = makeGetByIdUseCase()

    const { chamberRecord } = await chamber.execute({
      id: chamberId,
    })

    return reply.status(200).send({
      chamberRecord,
    })
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
