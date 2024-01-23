import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
// import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { edit } from './edit'
import { deleteCity } from './delete'
import { fetch } from './fetch'
import {
  cityCreateSchema,
  deleteCitieschema,
  editCitieschema,
  fetchCitieschema,
  getCitieschema,
} from './schemas'
import { getById } from './get-by-id'

export async function citiesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/cities',
    {
      schema: cityCreateSchema,
    },
    create,
  )

  app.put(
    '/cities/:cityId',
    {
      schema: editCitieschema,
    },
    edit,
  )

  app.delete(
    '/cities/:cityId',
    {
      schema: deleteCitieschema,
    },
    deleteCity,
  )

  app.get(
    '/cities',
    {
      schema: fetchCitieschema,
    },
    fetch,
  )

  app.get('/cities/:cityId', { schema: getCitieschema }, getById)
}
