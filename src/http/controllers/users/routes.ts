import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
// import { verifyUserRole } from '@/http/middlewares/verify-user-role'
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
  profileSchema,
  refreshTokenSchema,
  userCreateSchema,
} from './schemas'
import { profile } from './profile'
import { profileEdit } from './profile-edit'

export async function usersRoutes(app: FastifyInstance) {
  // Auth Routes
  app.post('/auth/login', { schema: authenticateSchema }, authenticate)

  app.patch('/auth/refresh', { schema: refreshTokenSchema }, refresh)

  // User Profile Routes
  app.get(
    '/profile',
    {
      onRequest: [verifyJwt],
      schema: profileSchema,
    },
    profile,
  )

  app.put('/profile/:userId', profileEdit)

  // Admin User Routes
  app.post(
    '/users',
    {
      onRequest: [verifyJwt],
      schema: userCreateSchema,
    },
    register,
  )

  app.put(
    '/users/:userId',
    {
      onRequest: [verifyJwt],
      schema: editUserSchema,
    },
    edit,
  )

  app.delete(
    '/users/:userId',
    {
      onRequest: [verifyJwt],
      schema: deleteUserSchema,
    },
    deleteUser,
  )

  app.get(
    '/users',
    {
      onRequest: [verifyJwt],
      schema: fetchUsersSchema,
    },
    fetch,
  )

  app.get(
    '/users/cpf',
    {
      onRequest: [verifyJwt],
      schema: getUserByCpfSchema,
    },
    getByCpf,
  )

  app.get(
    '/users/:userId',
    {
      onRequest: [verifyJwt],
      schema: getUserByIdSchema,
    },
    info,
  )
}
