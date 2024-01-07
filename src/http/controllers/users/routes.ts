import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { refresh } from './refresh'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { info } from './info'
import { getByCpf } from './get-by-cpf'
import { edit } from './edit'
import { deleteUser } from './delete'
import { fetch } from './fetch'
import {
  authenticateSchema,
  deleteUserSchema,
  editUserSchema,
  fetchUsersSchema,
  getUserByCpfSchema,
  getUserByIdSchema,
  refreshTokenSchema,
  userCreateSchema,
} from './schemas'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/auth/login', { schema: authenticateSchema }, authenticate)
  app.patch('/auth/refresh', { schema: refreshTokenSchema }, refresh)

  app.post(
    '/users',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: userCreateSchema,
    },
    register,
  )

  app.put(
    '/users/:userId',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')], schema: editUserSchema },
    edit,
  )

  app.delete(
    '/users/:userId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: deleteUserSchema,
    },
    deleteUser,
  )

  app.get(
    '/users',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: fetchUsersSchema,
    },
    fetch,
  )

  app.get(
    '/users/cpf',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: getUserByCpfSchema,
    },
    getByCpf,
  )

  app.get(
    '/users/:userId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: getUserByIdSchema,
    },
    info,
  )
}
