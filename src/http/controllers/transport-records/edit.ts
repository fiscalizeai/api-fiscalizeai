import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { error } from 'console'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeEditUseCase } from '@/use-cases/factories/tranport-records/make-edit-use-case'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editTransportRecordParamsSchema = z.object({
    transportId: z.string().uuid(),
  })

  const editTransportRecordBodySchema = z.object({
    data: z.object({
      month: z.coerce.date().optional(),
      bus: z.number().optional(),
      cars: z.number().optional(),
      machines: z.number().optional(),
      total: z.number().optional(),
    }),
  })

  const { transportId } = editTransportRecordParamsSchema.parse(request.params)
  const { data } = editTransportRecordBodySchema.parse(request.body)

  try {
    const editTransportRecordUseCase = makeEditUseCase()

    await editTransportRecordUseCase.execute({
      id: transportId,
      data,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof RecordsAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof RecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }
  }

  throw error
}
