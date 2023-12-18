import { makeGetUserInfoUseCase } from '@/use-cases/factories/users/make-get-user-info-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function info(request: FastifyRequest, reply: FastifyReply) {
  const getUserInfo = makeGetUserInfoUseCase()

  const { user } = await getUserInfo.execute({
    userId: request.id,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password: undefined,
    },
  })
}
