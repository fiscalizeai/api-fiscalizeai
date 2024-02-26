import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { AccessDeniedError } from '@/use-cases/errors/users/access-denied'
import { makeAuthenticateUseCase } from '@/use-cases/factories/users/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
        city: user.city_id,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '1d',
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
        city: user.city_id,
      },
      {
        sign: {
          sub: user.id,
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
      .header('Access-Control-Allow-Origin', 'http://localhost:3000')
      .header('Access-Control-Allow-Credentials', 'true')
      .status(200)
      .send({
        authMetadata: {
          token,
          expireIn: 86400,
          refreshToken,
        },
        user: {
          ...user,
          cpf: undefined,
          password: undefined,
        },
      })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof AccessDeniedError) {
      return reply.status(403).send({ message: error.message })
    }

    throw error
  }
}
