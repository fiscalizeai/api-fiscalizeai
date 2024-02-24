import { UserNotFoundError } from '@/use-cases/errors/users/user-not-found'
import { makeGetUserInfoUseCase } from '@/use-cases/factories/users/make-get-user-info-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function info(request: FastifyRequest, reply: FastifyReply) {
  const infoParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  try {
    const { userId } = infoParamsSchema.parse(request.params)

    const getUserInfo = makeGetUserInfoUseCase()

    const { user } = await getUserInfo.execute({
      userId,
    })

    return reply.status(200).send({
      user: {
        ...user,
        password: undefined,
      },
    })
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
  }
}
