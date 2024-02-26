import { CityAlreadyExistsError } from '@/use-cases/errors/cities/city-already-exists'
import { CityNotFoundError } from '@/use-cases/errors/cities/city-not-found'
import { makeEditUseCase } from '@/use-cases/factories/cities/make-edit-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editCityParamsSchema = z.object({
    cityId: z.string().cuid(),
  })

  const editCityBodySchema = z.object({
    data: z.object({
      name: z.string(),
      state: z.string(),
    }),
  })

  const { cityId } = editCityParamsSchema.parse(request.params)
  const { data } = editCityBodySchema.parse(request.body)

  try {
    const editCityUseCase = makeEditUseCase()

    await editCityUseCase.execute({
      id: cityId,
      data,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof CityAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof CityNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
