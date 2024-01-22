import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import {
  FetchPersonRecordsSchema,
  RegisterPersonRecordsSchema,
  deletePersonRecordSchema,
  editPersonRecordSchema,
  getPersonRecordByIdSchema,
} from './schemas'
import { fetch } from './fetch'
import { edit } from './edit'
import { getById } from './get-by-id'
import { deletePersonRecord } from './delete'

export async function personRecordsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/person',
    {
      // onRequest: verifyUserRole('ADMIN'),
      schema: RegisterPersonRecordsSchema,
    },
    register,
  )

  app.get('/person', { schema: FetchPersonRecordsSchema }, fetch)

  app.get('/person/:personId', { schema: getPersonRecordByIdSchema }, getById)

  app.put(
    '/person/:personId',
    {
      // onRequest: verifyUserRole('ADMIN'),
      schema: editPersonRecordSchema,
    },
    edit,
  )

  app.delete(
    '/person/:personId',
    { schema: deletePersonRecordSchema },
    deletePersonRecord,
  )
}
