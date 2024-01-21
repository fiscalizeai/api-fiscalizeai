import { FastifySchema } from 'fastify'

export const RegisterPersonRecordsSchema: FastifySchema = {
  description: 'POST create a new person record',
  tags: ['person'],
  body: {
    type: 'object',
    properties: {
      month: { type: 'string' },
      contractors: { type: 'number' },
      headcounts: { type: 'number' },
      staffs: { type: 'number' },
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

export const FetchPersonRecordsSchema: FastifySchema = {
  description: 'GET a fetch person record',
  tags: ['person'],
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
        personRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              contractors: { type: 'number' },
              headcounts: { type: 'number' },
              staffs: { type: 'number' },
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

export const editPersonRecordSchema: FastifySchema = {
  description: 'PUT edit a person record',
  tags: ['person'],
  params: {
    personId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          month: { type: 'string' },
          contractors: { type: 'number' },
          headcounts: { type: 'number' },
          staffs: { type: 'number' },
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

export const getPersonRecordByIdSchema: FastifySchema = {
  description: 'GET a person record by id',
  tags: ['person'],
  params: {
    personId: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        personRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            month: { type: 'string' },
            contractors: { type: 'number' },
            staffs: { type: 'number' },
            headcounts: { type: 'number' },
            total: { type: 'number' },
            city_id: { type: 'string' },
            user_id: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
        },
      },
    },
  },
}

export const deletePersonRecordSchema: FastifySchema = {
  description: 'Delete a person record',
  tags: ['person'],
  params: {
    personId: { type: 'string' },
  },
  response: {
    204: {
      description: 'Successful',
      type: 'null',
    },
  },
}
