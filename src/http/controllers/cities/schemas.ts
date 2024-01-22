import { FastifySchema } from 'fastify'

export const cityCreateSchema: FastifySchema = {
  description: 'POST create a new city',
  tags: ['city'],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'city name' },
      state: {
        type: 'string',
        description: 'max length 2, example: MG, SP, MT',
      },
    },
  },
  response: {
    201: {
      description: 'Successful created',
      type: 'null',
    },
  },
}

export const editCitieschema: FastifySchema = {
  description: 'PUT edit a city',
  tags: ['city'],
  params: {
    cityId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'city name' },
          state: { type: 'string', description: 'city state' },
        },
      },
    },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'null',
    },
  },
}

export const deleteCitieschema: FastifySchema = {
  description: 'DELETE a city',
  tags: ['city'],
  params: {
    cityId: { type: 'string' },
  },
  response: {
    204: {
      description: 'Successful no content',
      type: 'null',
    },
  },
}

export const fetchCitieschema: FastifySchema = {
  description: 'GET fetch all cities',
  tags: ['city'],
  querystring: {
    type: 'object',
    required: ['page'],
    properties: {
      page: { type: 'number' },
      items: { type: 'number' },
      name: { type: 'string' },
      state: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful response result is array of cities',
      type: 'object',
      properties: {
        cities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              state: { type: 'string' },
              created_at: { type: 'string' },
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

export const getCitieschema: FastifySchema = {
  description: 'GET city by id',
  tags: ['city'],
  params: {
    cityId: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        city: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            state: { type: 'string' },
            created_at: { type: 'string' },
          },
        },
        usersCount: { type: 'number' },
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
  },
}
