import { ResouceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetUserInfoUseCase } from '@/use-cases/factories/users/make-get-user-info-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserInfoUseCase()

  const refreshBodySchema = z.object({
    refreshToken: z.string(),
  })

  let { refreshToken } = refreshBodySchema.parse(request.body)

  await request.jwtVerify()

  const { role } = request.user
  const { user } = await getUserProfile.execute({ userId: request.user.sub })

  if (!user) {
    throw new ResouceNotFoundError()
  }

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d', // TODO: Increase refresh time...
      },
    },
  )

  return reply.status(200).send({
    authMetadata: {
      token,
      expireIn: 600,
      refreshToken,
    },
    user: {
      ...user,
      password: undefined,
    },
  })
}
