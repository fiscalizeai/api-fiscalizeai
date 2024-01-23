import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { makeEditUseCase } from '@/use-cases/factories/education-records/make-edit-use-case'
import { error } from 'console'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editEducationRecordParamsSchema = z.object({
    educationId: z.string().uuid(),
  })

  const editEducationRecordBodySchema = z.object({
    data: z.object({
      year: z.coerce.number(),
      month: z.coerce.number().optional(),
      schools: z.number().optional(),
      students: z.number().optional(),
      teachers: z.number().optional(),
      total: z.number().optional(),
    }),
  })

  const { educationId } = editEducationRecordParamsSchema.parse(request.params)
  const { data } = editEducationRecordBodySchema.parse(request.body)

  try {
    const editEducationRecordUseCase = makeEditUseCase()

    await editEducationRecordUseCase.execute({
      id: educationId,
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
