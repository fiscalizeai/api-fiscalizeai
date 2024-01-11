import { ChamberAlreadyExistsError } from '@/use-cases/errors/chambers/chamber-already-exists'
import { makeRegisterUseCase } from '@/use-cases/factories/education-records/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    month: z.coerce.date(),
    schools: z.number(),
    students: z.number(),
    teachers: z.number(),
    total: z.number(),
  })

  const { month, schools, students, teachers, total } =
    registerBodySchema.parse(request.body)

  const { sub, chamber } = request.user

  console.log(chamber)

  console.log(month)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      month,
      schools,
      students,
      teachers,
      total,
      chamberId: chamber,
      userId: sub,
    })
  } catch (error) {
    if (error instanceof ChamberAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
