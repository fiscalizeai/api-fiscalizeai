import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { fetch } from './fetch'
import { getById } from './get-by-id'
import { FetchTransfersSchema, GetTransferSchema } from './schemas'
import { getTransferInBankByDate } from './get-transfer-in-bank-by-date'
import { feed } from './feed'
import { deleteFiles } from './delete-files'

export async function transfersRoutes(app: FastifyInstance) {
  app.get(
    '/transfers',
    { onRequest: [verifyJwt], schema: FetchTransfersSchema },
    fetch,
  )
  app.get('/transfers/:transferId', { schema: GetTransferSchema }, getById)

  app.post('/transfers-by-date', getTransferInBankByDate)
  app.get('/transfers/feed', feed)
  app.delete('/transfers', deleteFiles)
}
