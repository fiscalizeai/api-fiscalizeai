import fastify from 'fastify'
import { usersRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { chambersRoutes } from './http/controllers/chambers/routes'
import swaggerUi from '@fastify/swagger-ui'
import swagger from '@fastify/swagger'
import swaggerFile from './swagger.json'
import { educationRecordsRoutes } from './http/controllers/education-records/routes'

export const app = fastify()

app.register(cors, {
  origin: true,
  credentials: true,
  exposedHeaders: ['set-cookie'],
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
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
app.register(chambersRoutes)
app.register(educationRecordsRoutes)

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
