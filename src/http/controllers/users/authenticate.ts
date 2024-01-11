import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { ResouceNotFoundError } from '@/use-cases/errors/resource-not-found'
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
        chamber: user.chamber_id,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '10m',
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
        chamber: user.chamber_id,
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
        user: {
          ...user,
          cpf: undefined,
          password: undefined,
        },
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    if (err instanceof ResouceNotFoundError) {
      return reply.status(400).send({ message: err.message })
    } // TODO: Erro de acesso negado a plataforma

    throw err
  }
}
