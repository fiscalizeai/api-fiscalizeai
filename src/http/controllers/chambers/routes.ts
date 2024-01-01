import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { fetchByState } from './fetch-by-state'
import { edit } from './edit'
import { deleteChamber } from './delete'
import { fetch } from './fetch'

export async function chambersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/chambers', { onRequest: [verifyUserRole('ADMIN')] }, create)

  app.get('/chambers', { onRequest: [verifyUserRole('ADMIN')] }, fetch)

  app.get(
    '/chambers/fetch',
    { onRequest: [verifyUserRole('ADMIN')] },
    fetchByState,
  )
  app.patch(
    '/chambers/:chamberId/edit',
    { onRequest: [verifyUserRole('ADMIN')] },
    edit,
  )

  app.delete(
    '/chambers/:chamberId/delete',
    { onRequest: [verifyUserRole('ADMIN')] },
    deleteChamber,
  )
}
