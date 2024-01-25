import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { fetch } from './fetch'
import { getById } from './get-by-id'

export async function transfersRoutes(app: FastifyInstance) {
  app.get('/transfers', { onRequest: [verifyJwt] }, fetch)
  app.get('/transfers/:transferId', getById)
}
