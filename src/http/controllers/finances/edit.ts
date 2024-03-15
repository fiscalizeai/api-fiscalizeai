import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeEditUseCase } from '@/use-cases/factories/finances/make-edit.use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editFinanceParamsSchema = z.object({
    financeId: z.string().uuid(),
  })

  const editFinanceBodySchema = z.object({
    data: z.object({
      year: z.coerce
        .number()
        .min(1974)
        .max(new Date().getFullYear())
        .optional(),
      month: z.coerce.number().min(1).max(12).optional(),
      iptu: z.coerce.number().optional(),
      iss: z.coerce.number().optional(),
      itbi: z.coerce.number().optional(),
    }),
  })

  const { financeId } = editFinanceParamsSchema.parse(request.params)
  const { data } = editFinanceBodySchema.parse(request.body)

  try {
    const editFinanceUseCase = makeEditUseCase()

    await editFinanceUseCase.execute({
      id: financeId,
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
}
