import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeDeleteUseCase } from '@/use-cases/factories/finances/make-delete-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteFinance(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    financeId: z.string().uuid(),
  })

  const { financeId } = deleteParamsSchema.parse(request.params)

  try {
    const deleteUseCase = makeDeleteUseCase()

    await deleteUseCase.execute({
      id: financeId,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
