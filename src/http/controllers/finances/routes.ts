import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { register } from './register'
import { getById } from './get-by-id'
import { edit } from './edit'
import { fetch } from './fetch'
import { deleteFinance } from './delete'
import {
  DeleteFinanceSchema,
  EditFinanceSchema,
  FetchFinanceSchema,
  GetFinanceSchema,
  RegisterFinanceSchema,
} from './schemas'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function financesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/finance',
    {
      onRequest: verifyUserRole(['ADMIN', 'SECRETARY']),
      schema: RegisterFinanceSchema,
    },
    register,
  )

  app.get('/finance', { schema: FetchFinanceSchema }, fetch)

  app.get('/finance/:financeId', { schema: GetFinanceSchema }, getById)

  app.put(
    '/finance/:financeId',
    {
      onRequest: verifyUserRole(['ADMIN', 'SECRETARY']),
      schema: EditFinanceSchema,
    },
    edit,
  )

  app.delete(
    '/finance/:financeId',
    {
      onRequest: verifyUserRole(['ADMIN', 'SECRETARY']),
      schema: DeleteFinanceSchema,
    },
    deleteFinance,
  )
}
