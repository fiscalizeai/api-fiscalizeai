import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { metrics } from './metrics'
import { MetricsSchema } from './schema'

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/dashboard', { schema: MetricsSchema }, metrics)
}
