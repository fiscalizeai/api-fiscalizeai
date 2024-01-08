import { FastifySchema } from 'fastify'

export const chamberCreateSchema: FastifySchema = {
  description: 'POST create a new chamber',
  tags: ['chamber'],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'chamber name' },
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

export const editChamberSchema: FastifySchema = {
  description: 'GET fetch all chambers',
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
          name: { type: 'string', description: 'chamber name (optional)' },
          state: { type: 'string', description: 'chamber state (optional)' },
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

export const deleteChamberSchema: FastifySchema = {
  description: 'DELETE a chamber',
  tags: ['chamber'],
  params: {
    chamberId: { type: 'string' },
  },
  response: {
    204: {
      description: 'Successful no content',
      type: 'null',
    },
  },
}

export const fetchChamberSchema: FastifySchema = {
  description: 'GET fetch all chambers',
  tags: ['chamber'],
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
      description: 'Successful response result is array of chambers',
      type: 'object',
      properties: {
        chambers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              state: { type: 'string' },
              created_At: { type: 'string' },
            },
          },
        },
      },
    },
  },
}

export const fetchChamberByStateSchema: FastifySchema = {
  description: 'GET fetch all chambers',
  tags: ['chamber'],
  params: {
    state: { type: 'string' },
    page: { type: 'number' },
  },
  response: {
    200: {
      description: 'Successful response result is array of chambers',
      type: 'object',
      properties: {
        chambers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              state: { type: 'string' },
              created_At: { type: 'string' },
            },
          },
        },
      },
    },
  },
}
