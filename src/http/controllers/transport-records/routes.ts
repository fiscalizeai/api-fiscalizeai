import { FastifyInstance } from 'fastify'
import { register } from './register'
// import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import {
  FetchTransportRecordsSchema,
  RegisterTransportRecordsSchema,
  deleteTransportRecordSchema,
  editTransportRecordSchema,
  getTransportRecordByIdSchema,
} from './schemas'
import { deleteTransportRecord } from './delete'
import { edit } from './edit'
import { getById } from './get-by-id'
import { fetch } from './fetch'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function transportRecordsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/transport',
    {
      onRequest: verifyUserRole(['ADMIN', 'SECRETARY']),
      schema: RegisterTransportRecordsSchema,
    },
    register,
  )

  app.get('/transport', { schema: FetchTransportRecordsSchema }, fetch)

  app.get(
    '/transport/:transportId',
    { schema: getTransportRecordByIdSchema },
    getById,
  )

  app.put(
    '/transport/:transportId',
    {
      onRequest: verifyUserRole(['ADMIN', 'SECRETARY']),
      schema: editTransportRecordSchema,
    },
    edit,
  )

  app.delete(
    '/transport/:transportId',
    {
      onRequest: verifyUserRole(['ADMIN', 'SECRETARY']),
      schema: deleteTransportRecordSchema,
    },
    deleteTransportRecord,
  )
}
