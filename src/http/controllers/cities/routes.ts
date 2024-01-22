import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
// import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { edit } from './edit'
import { deleteCity } from './delete'
import { fetch } from './fetch'
import {
  cityCreateSchema,
  deleteCitySchema,
  editCitySchema,
  fetchCitySchema,
  getCitySchema,
} from './schemas'
import { getById } from './get-by-id'

export async function citiesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/cities',
    {
      // onRequest: [verifyUserRole('ADMIN')],
      schema: cityCreateSchema,
    },
    create,
  )

  app.put(
    '/cities/:cityId',
    {
      // onRequest: [verifyUserRole('ADMIN')],
      schema: editCitySchema,
    },
    edit,
  )

  app.delete(
    '/cities/:cityId',
    {
      // onRequest: [verifyUserRole('ADMIN')],
      schema: deleteCitySchema,
    },
    deleteCity,
  )

  app.get(
    '/cities',
    {
      // onRequest: [verifyUserRole('ADMIN')],
      schema: fetchCitySchema,
    },
    fetch,
  )

  app.get('/cities/:cityId', { schema: getCitySchema }, getById)
}
