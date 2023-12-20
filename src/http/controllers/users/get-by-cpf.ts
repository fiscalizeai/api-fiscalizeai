import { makeGetByCpfUseCase } from '@/use-cases/factories/users/make-get-by-cpf-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getByCpf(request: FastifyRequest, reply: FastifyReply) {
  const getByCpfQuerySchema = z.object({
    cpf: z.string(),
  })

  const { cpf } = getByCpfQuerySchema.parse(request.query)

  const getUserInfo = makeGetByCpfUseCase()

  const { user } = await getUserInfo.execute({
    cpf,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password: undefined,
    },
  })
}
