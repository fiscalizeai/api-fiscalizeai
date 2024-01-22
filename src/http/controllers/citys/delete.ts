import { CityAssociatedUsers } from '@/use-cases/errors/cities/city-associated-users'
import { CityNotFoundError } from '@/use-cases/errors/cities/city-not-found'
import { makeDeleteUseCase } from '@/use-cases/factories/cities/make-delete-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteCity(request: FastifyRequest, reply: FastifyReply) {
  const deleteParamsSchema = z.object({
    cityId: z.string().cuid(),
  })

  const { cityId } = deleteParamsSchema.parse(request.params)

  try {
    const deleteUseCase = makeDeleteUseCase()

    await deleteUseCase.execute({
      id: cityId,
    })
  } catch (error) {
    if (error instanceof CityNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof CityAssociatedUsers) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}
