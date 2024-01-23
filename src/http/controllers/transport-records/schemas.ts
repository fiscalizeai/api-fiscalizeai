import { FastifySchema } from 'fastify'

export const RegisterTransportRecordsSchema: FastifySchema = {
  description: 'POST create a new transport record',
  tags: ['transport'],
  body: {
    type: 'object',
    properties: {
      month: { type: 'number' },
      year: { type: 'number' },
      bus: { type: 'number' },
      cars: { type: 'number' },
      machines: { type: 'number' },
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

export const FetchTransportRecordsSchema: FastifySchema = {
  description: 'GET a fetch transport record',
  tags: ['transport'],
  querystring: {
    type: 'object',
    required: ['page'],
    properties: {
      page: { type: 'number' },
      items: { type: 'number' },
      month: { type: 'number' },
      year: { type: 'number' },
    },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        transport: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              bus: { type: 'number' },
              cars: { type: 'number' },
              machines: { type: 'number' },
              total: { type: 'number' },
              month: { type: 'number' },
              year: { type: 'number' },
              user_id: { type: 'string' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            pageSize: { type: 'number' },
            pageNumber: { type: 'number' },
            pageItems: { type: 'number' },
          },
        },
      },
    },
  },
}

export const editTransportRecordSchema: FastifySchema = {
  description: 'PUT edit a transport record',
  tags: ['transport'],
  params: {
    transportId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          month: { type: 'number' },
          year: { type: 'number' },
          bus: { type: 'number' },
          cars: { type: 'number' },
          machines: { type: 'number' },
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

export const getTransportRecordByIdSchema: FastifySchema = {
  description: 'GET a transport record by id',
  tags: ['transport'],
  params: {
    transportId: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        transportRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            month: { type: 'number' },
            year: { type: 'number' },
            bus: { type: 'number' },
            machines: { type: 'number' },
            cars: { type: 'number' },
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

export const deleteTransportRecordSchema: FastifySchema = {
  description: 'Delete a transport record',
  tags: ['transport'],
  params: {
    transportId: { type: 'string' },
  },
  response: {
    204: {
      description: 'Successful',
      type: 'null',
    },
  },
}
