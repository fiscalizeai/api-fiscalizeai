import { FastifySchema } from 'fastify'

export const RegisterHealthRecordsSchema: FastifySchema = {
  description: 'POST create a new health record',
  tags: ['health'],
  body: {
    type: 'object',
    properties: {
      month: { type: 'string' },
      doctors: { type: 'number' },
      services: { type: 'number' },
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

export const FetchHealthRecordsSchema: FastifySchema = {
  description: 'GET a fetch health record',
  tags: ['health'],
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
        healthRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              doctors: { type: 'number' },
              services: { type: 'number' },
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

export const editHealthRecordSchema: FastifySchema = {
  description: 'PUT edit a health record',
  tags: ['health'],
  params: {
    healthId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          month: { type: 'string' },
          doctors: { type: 'number' },
          services: { type: 'number' },
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

export const getHealthRecordByIdSchema: FastifySchema = {
  description: 'GET a health record by id',
  tags: ['health'],
  params: {
    healthId: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        healthRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            month: { type: 'string' },
            doctors: { type: 'number' },
            services: { type: 'number' },
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

export const deleteHealthRecordSchema: FastifySchema = {
  description: 'Delete a health record',
  tags: ['health'],
  params: {
    healthId: { type: 'string' },
  },
  response: {
    204: {
      description: 'Successful',
      type: 'null',
    },
  },
}
