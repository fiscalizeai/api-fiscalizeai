import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { educationRecordsRegisterSchema } from './schemas'

export async function educationRecordsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/education',
    {
      onRequest: verifyUserRole('SECRETARY'),
      schema: educationRecordsRegisterSchema,
    },
    register,
  )
}
