import { ResouceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetUserInfoUseCase } from '@/use-cases/factories/users/make-get-user-info-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })
  const getUserProfile = makeGetUserInfoUseCase()

  const { role, city } = request.user

  const { user } = await getUserProfile.execute({ userId: request.user.sub })

  if (!user) {
    throw new ResouceNotFoundError()
  }

  const token = await reply.jwtSign(
    { role, city },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role, city },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    })
    .status(200)
    .send({
      authMetadata: {
        token,
        expireIn: 600,
        refreshToken,
      },
      user: {
        ...user,
        cpf: undefined,
        password: undefined,
      },
    })
}
