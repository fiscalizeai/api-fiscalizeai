import { CityNotFoundError } from '@/use-cases/errors/cities/city-not-found'
import { makeGetByIdUseCase } from '@/use-cases/factories/citys/make-get-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getByIdParamsSchema = z.object({
    cityId: z.string(),
  })

  const { cityId } = getByIdParamsSchema.parse(request.params)

  try {
    const cityById = makeGetByIdUseCase()

    const { city, usersCount, users } = await cityById.execute({
      id: cityId,
    })

    return reply.status(200).send({
      city,
      usersCount,
      users,
    })
  } catch (error) {
    if (error instanceof CityNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
