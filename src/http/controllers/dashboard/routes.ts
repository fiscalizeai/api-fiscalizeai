import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { metrics } from './metrics'
import {
  AnnualTransfersSchema,
  CurrentMonthTransfersSchema,
  LastSixMonthsSchema,
  MetricsSchema,
} from './schema'
import { annualTransfers } from './annual-transfers'
import { LastSixMonthsTransfers } from './last-six-months'
import { currentMonthTransfers } from './current-month-transfers'

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/dashboard/month', { schema: MetricsSchema }, metrics)

  app.get(
    '/dashboard/annual-transfers',
    { schema: AnnualTransfersSchema },
    annualTransfers,
  )

  app.get(
    '/dashboard/last-six-months',
    { schema: LastSixMonthsSchema },
    LastSixMonthsTransfers,
  )

  app.get(
    '/dashboard/current-month-transfers',
    { schema: CurrentMonthTransfersSchema },
    currentMonthTransfers,
  )
}
