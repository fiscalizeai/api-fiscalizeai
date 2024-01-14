import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { edit } from './edit'
import { deleteChamber } from './delete'
import { fetch } from './fetch'
import {
  chamberCreateSchema,
  deleteChamberSchema,
  editChamberSchema,
  fetchChamberSchema,
  getChamberSchema,
} from './schemas'
import { getById } from './get-by-id'

export async function chambersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/chambers',
    { onRequest: [verifyUserRole('ADMIN')], schema: chamberCreateSchema },
    create,
  )

  app.put(
    '/chambers/:chamberId',
    { onRequest: [verifyUserRole('ADMIN')], schema: editChamberSchema },
    edit,
  )

  app.delete(
    '/chambers/:chamberId',
    { onRequest: [verifyUserRole('ADMIN')], schema: deleteChamberSchema },
    deleteChamber,
  )

  app.get(
    '/chambers',
    { onRequest: [verifyUserRole('ADMIN')], schema: fetchChamberSchema },
    fetch,
  )

  app.get('/chambers/:chamberId', { schema: getChamberSchema }, getById)
}
