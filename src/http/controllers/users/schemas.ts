import { FastifySchema } from 'fastify'

export const userCreateSchema: FastifySchema = {
  description: 'POST create a new user',
  tags: ['user'],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      cpf: { type: 'string' },
      role: { type: 'string', description: 'ADMIN | MEMBER | SECRETARY' },
      chamberId: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'Successful created',
      type: 'null',
    },
  },
}

export const getUserByCpfSchema: FastifySchema = {
  description: 'GET a user by cpf',
  tags: ['user'],
  params: {
    cpf: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            cpf: { type: 'string' },
            permission: { type: 'string' },
            role: { type: 'string' },
            chamber_id: { type: 'string' },
            created_At: { type: 'string' },
          },
        },
      },
    },
  },
}

export const authenticateSchema: FastifySchema = {
  description: 'POST authenticate user',
  tags: ['auth'],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', description: 'user email' },
      password: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  },
}

export const refreshTokenSchema: FastifySchema = {
  description: 'PATCH a refresh token user',
  tags: ['auth'],

  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  },
}

export const getUserByIdSchema: FastifySchema = {
  description: 'GET a user by id',
  tags: ['user'],
  params: {
    userId: { type: 'string' },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            cpf: { type: 'string' },
            permission: { type: 'string' },
            role: { type: 'string' },
            chamber_id: { type: 'string' },
            created_At: { type: 'string' },
          },
        },
      },
    },
  },
}

export const deleteUserSchema: FastifySchema = {
  description: 'DELETE a user',
  tags: ['user'],
  params: {
    userId: { type: 'string' },
  },
  response: {
    204: {
      description: 'Successful no content',
      type: 'null',
    },
  },
}

export const editUserSchema: FastifySchema = {
  description: 'PUT edit a user',
  tags: ['user'],
  params: {
    userId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'user name (optional)' },
          email: { type: 'string', description: 'user email (optional)' },
          cpf: { type: 'string', description: 'user cpf (optional)' },
          password: { type: 'string', description: 'user password (optional)' },
          permission: {
            type: 'string',
            description: 'ACCEPTED | DENIED (optional)',
          },
          role: {
            type: 'string',
            description: 'MEMBER | ADMIN | SECRETARY (optional)',
          },
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

export const fetchUsersSchema: FastifySchema = {
  description: 'GET a fetch all users',
  tags: ['user'],
  params: {
    page: { type: 'number' },
  },
  response: {
    200: {
      description: 'Successful response result is array of users',
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              cpf: { type: 'string' },
              permission: { type: 'string' },
              role: { type: 'string' },
              chamber_id: { type: 'string' },
              created_At: { type: 'string' },
            },
          },
        },
      },
    },
  },
}

export const fetchUserByNameSchema: FastifySchema = {
  description: 'GET a fetch all users by name',
  tags: ['user'],
  params: {
    query: { type: 'string' },
    page: { type: 'number' },
  },
  response: {
    200: {
      description: 'Successful response result is array of users',
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              cpf: { type: 'string' },
              permission: { type: 'string' },
              role: { type: 'string' },
              chamber_id: { type: 'string' },
              created_At: { type: 'string' },
            },
          },
        },
      },
    },
  },
}

export const fetchUsersByChamberSchema: FastifySchema = {
  description: 'GET a fetch all users by chamber',
  tags: ['user'],
  params: {
    city: { type: 'string' },
    state: { type: 'string' },
    page: { type: 'number' },
  },
  response: {
    200: {
      description: 'Successful response result is array of users',
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              cpf: { type: 'string' },
              permission: { type: 'string' },
              role: { type: 'string' },
              chamber_id: { type: 'string' },
              created_At: { type: 'string' },
            },
          },
        },
      },
    },
  },
}
