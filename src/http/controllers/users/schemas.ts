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
      cityId: { type: 'string' },
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
            status: { type: 'string' },
            role: { type: 'string' },
            city_id: { type: 'string' },
            created_at: { type: 'string' },
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
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        authMetadata: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            expireIn: { type: 'number' },
            refreshToken: { type: 'string' },
          },
        },
        user: {
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            city_id: { type: 'string' },
            status: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  },
}

export const profileSchema: FastifySchema = {
  description: 'GET profile user',
  tags: ['auth'],
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
            status: { type: 'string' },
            role: { type: 'string' },
            city_id: { type: 'string' },
            created_at: { type: 'string' },
          },
        },
      },
    },
  },
}

export const refreshTokenSchema: FastifySchema = {
  description: 'PATCH a refresh token user',
  tags: ['auth'],
  // body: {
  //   type: 'object',
  //   properties: {
  //     refreshToken: { type: 'string' },
  //   },
  // },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        authMetadata: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            expireIn: { type: 'number' },
            refreshToken: { type: 'string' },
          },
        },
        user: {
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            city_id: { type: 'string' },
            status: { type: 'string' },
            role: { type: 'string' },
          },
        },
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
            status: { type: 'string' },
            role: { type: 'string' },
            city_id: { type: 'string' },
            created_at: { type: 'string' },
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
          status: {
            type: 'string',
            description: 'ACCEPTED | DENIED (optional)',
          },
          role: {
            type: 'string',
            description: 'MEMBER | ADMIN | SECRETARY (optional)',
          },
          city_id: { type: 'string', description: 'CUID (optional)' },
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
  querystring: {
    type: 'object',
    required: ['page'],
    properties: {
      page: { type: 'number' },
      items: { type: 'number' },
      name: { type: 'string' },
      role: { type: 'string' },
      status: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
    },
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
              status: { type: 'string' },
              role: { type: 'string' },
              city_id: { type: 'string' },
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

export const profileEditUserSchema: FastifySchema = {
  description: 'PUT edit a profile user',
  tags: ['user'],
  params: {
    userId: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      old_password: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'user name (optional)' },
          email: { type: 'string', description: 'user email (optional)' },
          password: { type: 'string', description: 'user password (optional)' },
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
