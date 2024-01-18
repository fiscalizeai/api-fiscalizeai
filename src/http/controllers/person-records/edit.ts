import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { makeEditUseCase } from '@/use-cases/factories/person-records/make-edit-use-case'
import { error } from 'console'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editPersonRecordParamsSchema = z.object({
    personId: z.string().uuid(),
  })

  const editPersonRecordBodySchema = z.object({
    data: z.object({
      month: z.coerce.date().optional(),
      contractors: z.number().optional(),
      headcounts: z.number().optional(),
      staffs: z.number().optional(),
      total: z.number().optional(),
    }),
  })

  const { personId } = editPersonRecordParamsSchema.parse(request.params)
  const { data } = editPersonRecordBodySchema.parse(request.body)

  try {
    const editPersonRecordUseCase = makeEditUseCase()

    await editPersonRecordUseCase.execute({
      id: personId,
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
