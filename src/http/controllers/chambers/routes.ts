import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { fetch } from './fetch'
import { edit } from './edit'
import { deleteChamber } from './delete'

export async function chambersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/chambers', { onRequest: [verifyUserRole('ADMIN')] }, create)
  app.post('/chambers/fetch', { onRequest: [verifyUserRole('ADMIN')] }, fetch)
  app.patch('/chambers/:chamberId', edit) // adicionar / edit na frente

  app.delete(
    '/chambers/:chamberId/delete',
    { onRequest: [verifyUserRole('ADMIN')] },
    deleteChamber,
  )
}
