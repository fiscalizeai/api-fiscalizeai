import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { makeRegisterUseCase } from '@/use-cases/factories/chamber-records/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  // Verificando se o JWT é valido, usando apenas os cookie
  request.jwtVerify({ onlyCookie: true })

  // Definindo o esquema de validação para os parametros, o coerce converte para número
  const registerBodySchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(1974).max(new Date().getFullYear()),
    contractors: z.number(),
    headcounts: z.number(),
    staffs: z.number(),
    total: z.number(),
  })

  const { month, year, contractors, headcounts, staffs, total } =
    registerBodySchema.parse(request.body)

  const { sub, city } = request.user

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      month,
      year,
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

    // Se o erro não for do tipo RecordsAlreadyExistsError nem do tipo InvalidUserOrCityError, lançamos o erro para ser tratado em outro lugar
    throw error
  }
}
