import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { refresh } from './refresh'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { info } from './info'
import { searchByName } from './search-by-name'
import { getByCpf } from './get-by-cpf'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)

  app.get('/users/cpf', getByCpf)

  app.get(
    '/users/fetch/name',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    searchByName,
  )

  app.post(
    '/users',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    register,
  )

  app.get(
    '/users/:userId/info',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    info,
  )
}
