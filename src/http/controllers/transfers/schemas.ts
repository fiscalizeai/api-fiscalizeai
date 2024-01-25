import { FastifySchema } from 'fastify'

export const FetchTransfersSchema: FastifySchema = {
  description: 'GET a fetch transfers',
  tags: ['transfer'],
  querystring: {
    type: 'object',
    required: ['page'],
    properties: {
      page: { type: 'number' },
      items: { type: 'number' },
      demonstrative: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        transfers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              demonstrative: { type: 'string' },
              created_at: { type: 'string' },
              parcel: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    parcel: { type: 'string' },
                    value: { type: 'string' },
                    date: { type: 'string' },
                    created_at: { type: 'string' },
                    transfer_id: { type: 'string' },
                  },
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

export const GetTransferSchema: FastifySchema = {
  description: 'GET a fetch transfers',
  tags: ['transfer'],
  querystring: {
    type: 'object',
    required: ['page'],
    properties: {
      page: { type: 'number' },
      items: { type: 'number' },
      demonstrative: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        transfer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            demonstrative: { type: 'string' },
            created_at: { type: 'string' },
            parcel: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  parcel: { type: 'string' },
                  value: { type: 'string' },
                  date: { type: 'string' },
                  created_at: { type: 'string' },
                  transfer_id: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
}
