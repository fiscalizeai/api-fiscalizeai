import { FastifyInstance } from 'fastify'
import { register } from './register'
// import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import {
  FetchChamberRecordsSchema,
  RegisterChamberRecordsSchema,
  deleteChamberRecordSchema,
  editChamberRecordSchema,
  getChamberRecordByIdSchema,
} from './schemas'
import { fetch } from './fetch'
import { edit } from './edit'
import { getById } from './get-by-id'
import { deleteChamberRecord } from './delete'

export async function chamberRecordsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/chamber',
    {
      // onRequest: verifyUserRole('ADMIN'),
      schema: RegisterChamberRecordsSchema,
    },
    register,
  )

  app.get('/chamber', { schema: FetchChamberRecordsSchema }, fetch)

  app.get(
    '/chamber/:chamberId',
    { schema: getChamberRecordByIdSchema },
    getById,
  )

  app.put(
    '/chamber/:chamberId',
    {
      // onRequest: verifyUserRole('ADMIN'),
      schema: editChamberRecordSchema,
    },
    edit,
  )

  app.delete(
    '/chamber/:chamberId',
    { schema: deleteChamberRecordSchema },
    deleteChamberRecord,
  )
}
