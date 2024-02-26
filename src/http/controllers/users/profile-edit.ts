import { EmailAlreadyInUseError } from '@/use-cases/errors/users/email-already-in-use'
import { OldPasswordNotMatchError } from '@/use-cases/errors/users/old-password-not-match'
import { UserNotFoundError } from '@/use-cases/errors/users/user-not-found'
import { makeProfileEditUseCase } from '@/use-cases/factories/users/make-profile-edit-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function profileEdit(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editUserParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const editUserBodySchema = z.object({
    old_password: z.string().optional(),
    data: z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
    }),
  })

  const { userId } = editUserParamsSchema.parse(request.params)
  const { data, old_password } = editUserBodySchema.parse(request.body)

  try {
    const editUserUseCase = makeProfileEditUseCase()

    await editUserUseCase.execute({
      userId,
      old_password,
      data,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof OldPasswordNotMatchError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({ message: error.message })
    }
  }
}
