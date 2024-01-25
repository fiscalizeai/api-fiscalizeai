import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetByIdUseCase } from '@/use-cases/factories/transfers/make-get-by-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getBtIdParamsSchema = z.object({
    transferId: z.string(),
  })

  const { transferId } = getBtIdParamsSchema.parse(request.params)

  try {
    const transferUseCase = makeGetByIdUseCase()

    const { transfer } = await transferUseCase.execute({
      id: transferId,
    })

    return reply.status(200).send({
      transfer,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
