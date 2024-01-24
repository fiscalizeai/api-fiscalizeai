import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { fetch } from './fetch'

export async function transfersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/transfers', fetch)
}
