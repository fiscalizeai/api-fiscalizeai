import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { makeGetByIdUseCase } from '@/use-cases/factories/finances/make-get-by-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getByIdParamsSchema = z.object({
    financeId: z.string(),
  })

  const { financeId } = getByIdParamsSchema.parse(request.params)

  try {
    const financeUseCase = makeGetByIdUseCase()

    const { finance, total, totalFinance, totalTransfers } =
      await financeUseCase.execute({
        id: financeId,
      })

    return reply.status(200).send({
      finance,
      total,
      totalFinance,
      totalTransfers,
    })
  } catch (error) {
    if (error instanceof RecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }
  }
}
