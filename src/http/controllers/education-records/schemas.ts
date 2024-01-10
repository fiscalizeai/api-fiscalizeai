import { FastifySchema } from 'fastify'

export const educationRecordsRegisterSchema: FastifySchema = {
  description: 'POST create a new education record',
  tags: ['education'],
  body: {
    type: 'object',
    properties: {
      month: { type: 'string' },
      schools: { type: 'number' },
      students: { type: 'number' },
      teachers: { type: 'number' },
      total: { type: 'number' },
      chamberId: { type: 'string' },
      userId: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'Successful created',
      type: 'null',
    },
  },
}
