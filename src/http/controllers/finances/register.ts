import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { makeRegisterUseCase } from '@/use-cases/factories/finances/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  request.jwtVerify({ onlyCookie: true })

  const registerBodySchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(1974).max(new Date().getFullYear()),
    iptu: z.coerce.number(),
    iss: z.coerce.number(),
    itbi: z.coerce.number(),
  })

  const { month, year, iptu, iss, itbi } = registerBodySchema.parse(
    request.body,
  )

  const { sub, city } = request.user

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      month,
      year,
      iptu,
      iss,
      itbi,
      cityId: city,
      userId: sub,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof RecordsAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof InvalidUserOrCityError) {
      return reply.status(404).send({ message: error.message })
    }
  }
}
