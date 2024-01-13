import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role, chamber } = request.user

  const token = await reply.jwtSign(
    { role, chamber },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role, chamber },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d', // TODO: Increase refresh time...
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      authMetadata: {
        token,
        expireIn: 600,
        refreshToken,
      },
    })
}
