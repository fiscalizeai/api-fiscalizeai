import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { makeRegisterUseCase } from '@/use-cases/factories/person-records/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  request.jwtVerify({ onlyCookie: true })

  const registerBodySchema = z.object({
    month: z.coerce.date(),
    contractors: z.number(),
    headcounts: z.number(),
    staffs: z.number(),
    total: z.number(),
  })

  const { month, contractors, headcounts, staffs, total } =
    registerBodySchema.parse(request.body)

  const { sub, city } = request.user

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      month,
      contractors,
      headcounts,
      staffs,
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
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
