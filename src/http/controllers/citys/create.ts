import { CityAlreadyExistsError } from '@/use-cases/errors/citys/city-already-exists'
import { makeCreateUseCase } from '@/use-cases/factories/citys/make-create-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    state: z.string().max(2),
  })

  const { name, state } = createBodySchema.parse(request.body)

  try {
    const registerUseCase = makeCreateUseCase()

    await registerUseCase.execute({
      name,
      state,
    })
  } catch (error) {
    if (error instanceof CityAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
