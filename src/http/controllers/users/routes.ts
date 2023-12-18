import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', { onRequest: [verifyUserRole('ADMIN')] }, register)

  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)
}
