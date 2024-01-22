import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import {
  FetchHealthRecordsSchema,
  RegisterHealthRecordsSchema,
  deleteHealthRecordSchema,
  editHealthRecordSchema,
  getHealthRecordByIdSchema,
} from './schemas'
import { fetch } from './fetch'
import { getById } from './get-by-id'
import { edit } from './edit'
import { deleteHealthRecord } from './delete'

export async function healthRecordsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/health',
    {
      // onRequest: verifyUserRole('ADMIN'),
      schema: RegisterHealthRecordsSchema,
    },
    register,
  )

  app.get('/health', { schema: FetchHealthRecordsSchema }, fetch)

  app.get('/health/:healthId', { schema: getHealthRecordByIdSchema }, getById)

  app.put(
    '/health/:healthId',
    {
      // onRequest: verifyUserRole('ADMIN'),
      schema: editHealthRecordSchema,
    },
    edit,
  )

  app.delete(
    '/health/:healthId',
    { schema: deleteHealthRecordSchema },
    deleteHealthRecord,
  )
}
