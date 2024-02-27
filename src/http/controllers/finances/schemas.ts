import { FastifySchema } from 'fastify'

export const RegisterFinanceSchema: FastifySchema = {
  description: 'POST create a finance',
  tags: ['finance'],
  body: {
    type: 'object',
    properties: {
      month: { type: 'number' },
      year: { type: 'number' },
      iptu: { type: 'number' },
      iss: { type: 'number' },
      itbi: { type: 'number' },
    },
  },
  response: {
    201: {
      description: 'Successful created',
      type: 'null',
    },
  },
}

export const GetFinanceSchema: FastifySchema = {
  description: 'Get a finance by id',
  tags: ['finance'],
  params: {
    financeId: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        finance: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            iptu: { type: 'number' },
            iss: { type: 'number' },
            itbi: { type: 'number' },
            month: { type: 'number' },
            year: { type: 'number' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
        },
        total: { type: 'number' },
        totalFinance: { type: 'number' },
        totalTransfers: { type: 'number' },
      },
    },
  },
}

export const FetchFinanceSchema: FastifySchema = {
  description: 'Fetch a finances',
  tags: ['finance'],
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
        finances: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              iptu: { type: 'number' },
              iss: { type: 'number' },
              itbi: { type: 'number' },
              month: { type: 'number' },
              year: { type: 'number' },
              created_at: { type: 'string' },
              totalTransfers: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  value: { type: 'string' },
                },
              },
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

export const EditFinanceSchema: FastifySchema = {
  description: 'PUT edit a finance',
  tags: ['finance'],
  params: {
    financeId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          month: { type: 'number' },
          year: { type: 'number' },
          iptu: { type: 'number' },
          iss: { type: 'number' },
          itbi: { type: 'number' },
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

export const DeleteFinanceSchema: FastifySchema = {
  description: 'Delete a finance',
  tags: ['finance'],
  params: {
    financeId: { type: 'string' },
  },
  response: {
    204: {
      description: 'Successful',
      type: 'null',
    },
  },
}
