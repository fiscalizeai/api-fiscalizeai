import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { fetch } from './fetch'
import { getById } from './get-by-id'
import { FetchTransfersSchema, GetTransferSchema } from './schemas'

export async function transfersRoutes(app: FastifyInstance) {
  app.get(
    '/transfers',
    { onRequest: [verifyJwt], schema: FetchTransfersSchema },
    fetch,
  )
  app.get('/transfers/:transferId', { schema: GetTransferSchema }, getById)
}
