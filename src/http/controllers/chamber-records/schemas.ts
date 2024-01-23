import { FastifySchema } from 'fastify'

export const RegisterChamberRecordsSchema: FastifySchema = {
  description: 'POST create a new chamber record',
  tags: ['chamber'],
  body: {
    type: 'object',
    properties: {
      month: { type: 'number' },
      year: { type: 'number' },
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

export const FetchChamberRecordsSchema: FastifySchema = {
  description: 'GET a fetch chamber record',
  tags: ['chamber'],
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
        chamber: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              contractors: { type: 'number' },
              headcounts: { type: 'number' },
              staffs: { type: 'number' },
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

export const editChamberRecordSchema: FastifySchema = {
  description: 'PUT edit a chamber record',
  tags: ['chamber'],
  params: {
    chamberId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          month: { type: 'number' },
          year: { type: 'number' },
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

export const getChamberRecordByIdSchema: FastifySchema = {
  description: 'GET a chamber record by id',
  tags: ['chamber'],
  params: {
    chamberId: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        chamberRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            month: { type: 'number' },
            year: { type: 'number' },
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

export const deleteChamberRecordSchema: FastifySchema = {
  description: 'Delete a chamber record',
  tags: ['chamber'],
  params: {
    chamberId: { type: 'string' },
  },
  response: {
    204: {
      description: 'Successful',
      type: 'null',
    },
  },
}
