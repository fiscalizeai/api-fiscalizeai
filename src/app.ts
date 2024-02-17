import fastify from 'fastify'
import cors from '@fastify/cors'

import { env } from './env'
import { ZodError } from 'zod'

import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import swagger from '@fastify/swagger'
import swaggerFile from './swagger.json'
import swaggerUi from '@fastify/swagger-ui'

import { usersRoutes } from './http/controllers/users/routes'
import { citiesRoutes } from './http/controllers/cities/routes'
import { healthRecordsRoutes } from './http/controllers/health-records/routes'
import { chamberRecordsRoutes } from './http/controllers/chamber-records/routes'
import { educationRecordsRoutes } from './http/controllers/education-records/routes'
import { transportRecordsRoutes } from './http/controllers/transport-records/routes'
import { transfersRoutes } from './http/controllers/transfers/routes'
import { dashboardRoutes } from './http/controllers/dashboard/routes'
import { financesRoutes } from './http/controllers/finances/routes'

export const app = fastify()

app.register(cors, {
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '1d', // 10M
  },
})

app.register(fastifyCookie)

app.register(swagger, {
  swagger: swaggerFile,
})

app.register(swaggerUi, {
  routePrefix: '/documentation',
})

app.register(usersRoutes)
app.register(citiesRoutes)
app.register(educationRecordsRoutes)
app.register(transportRecordsRoutes)
app.register(chamberRecordsRoutes)
app.register(healthRecordsRoutes)
app.register(financesRoutes)
app.register(transfersRoutes)
app.register(dashboardRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
