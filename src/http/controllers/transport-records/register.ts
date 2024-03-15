import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/tranport-records/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  request.jwtVerify({ onlyCookie: true })

  const registerBodySchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(1974).max(new Date().getFullYear()),
    bus: z.number(),
    cars: z.number(),
    machines: z.number(),
    total: z.number(),
  })

  const { month, year, bus, cars, machines, total } = registerBodySchema.parse(
    request.body,
  )

  const { sub, city } = request.user

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      month,
      year,
      bus,
      cars,
      machines,
      total,
      cityId: city,
      userId: sub,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof RecordsAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof InvalidUserOrCityError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
