import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { educationRecordsRegisterSchema } from './schemas'
import { fetch } from './fetch'

export async function educationRecordsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/educations',
    {
      onRequest: verifyUserRole('ADMIN'),
      schema: educationRecordsRegisterSchema,
    },
    register,
  )

  app.get('/educations', fetch)
}
