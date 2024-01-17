import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { InvalidUserOrChamberError } from '@/use-cases/errors/records/invalid-user-or-chamber'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/use-cases/factories/tranport-records/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  request.jwtVerify({ onlyCookie: true })

  const registerBodySchema = z.object({
    month: z.coerce.date(),
    bus: z.number(),
    cars: z.number(),
    machines: z.number(),
    total: z.number(),
  })

  const { month, bus, cars, machines, total } = registerBodySchema.parse(
    request.body,
  )

  const { sub, chamber } = request.user

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      month,
      bus,
      cars,
      machines,
      total,
      chamberId: chamber,
      userId: sub,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof RecordsAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof InvalidUserOrChamberError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
