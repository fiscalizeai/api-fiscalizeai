import { FastifySchema } from 'fastify'

export const RegisterEducationRecordsSchema: FastifySchema = {
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
    },
  },
  response: {
    201: {
      description: 'Successful created',
      type: 'null',
    },
  },
}

export const FetchEducationRecordsSchema: FastifySchema = {
  description: 'GET a fetch education record',
  tags: ['education'],
  querystring: {
    type: 'object',
    required: ['page'],
    properties: {
      page: { type: 'number' },
      items: { type: 'number' },
      date: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        educationRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              schools: { type: 'number' },
              students: { type: 'number' },
              teachers: { type: 'number' },
              total: { type: 'number' },
              month: { type: 'string' },
              user_id: { type: 'string' },
            },
          },
        },
      },
    },
  },
}

export const editEducationRecordSchema: FastifySchema = {
  description: 'PUT edit a education record',
  tags: ['education'],
  params: {
    educationId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          month: { type: 'string' },
          schools: { type: 'number' },
          students: { type: 'number' },
          teachers: { type: 'number' },
          total: {
            type: 'number',
          },
          updated_at: { type: 'string' },
        },
      },
    },
  },
  response: {
    204: {
      description: 'Successful no content',
      type: 'object',
    },
  },
}

export const getEducationRecordByIdSchema: FastifySchema = {
  description: 'GET a education record by id',
  tags: ['education'],
  params: {
    educationId: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        educationRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            month: { type: 'string' },
            schools: { type: 'number' },
            teachers: { type: 'number' },
            students: { type: 'number' },
            total: { type: 'number' },
            chamber_id: { type: 'string' },
            user_id: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
        },
      },
    },
  },
}
