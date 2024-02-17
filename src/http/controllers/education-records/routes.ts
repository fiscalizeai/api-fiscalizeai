import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import {
  FetchEducationRecordsSchema,
  RegisterEducationRecordsSchema,
  deleteEducationRecordSchema,
  editEducationRecordSchema,
  getEducationRecordByIdSchema,
} from './schemas'
import { fetch } from './fetch'
import { edit } from './edit'
import { getById } from './get-by-id'
import { deleteEducationRecord } from './delete'

export async function educationRecordsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/education',
    {
      onRequest: [verifyUserRole(['ADMIN', 'SECRETARY'])],
      schema: RegisterEducationRecordsSchema,
    },
    register,
  )

  app.get('/education', { schema: FetchEducationRecordsSchema }, fetch)

  app.get(
    '/education/:educationId',
    { schema: getEducationRecordByIdSchema },
    getById,
  )

  app.put(
    '/education/:educationId',
    {
      onRequest: [verifyUserRole(['ADMIN', 'SECRETARY'])],
      schema: editEducationRecordSchema,
    },
    edit,
  )

  app.delete(
    '/education/:educationId',
    {
      onRequest: [verifyUserRole(['ADMIN', 'SECRETARY'])],
      schema: deleteEducationRecordSchema,
    },
    deleteEducationRecord,
  )
}
