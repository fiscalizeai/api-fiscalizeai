import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import {
  FetchEducationRecordsSchema,
  RegisterEducationRecordsSchema,
  editEducationRecordSchema,
} from './schemas'
import { fetch } from './fetch'
import { edit } from './edit'

export async function educationRecordsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/education',
    {
      onRequest: verifyUserRole('ADMIN'),
      schema: RegisterEducationRecordsSchema,
    },
    register,
  )

  app.get('/education', { schema: FetchEducationRecordsSchema }, fetch)

  app.put(
    '/education/:educationId',
    { onRequest: verifyUserRole('ADMIN'), schema: editEducationRecordSchema },
    edit,
  )
}
