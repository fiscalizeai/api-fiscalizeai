import { FastifySchema } from 'fastify'

export const MetricsSchema: FastifySchema = {
  description: 'Get metrics of month',
  tags: ['dashboard'],
  querystring: {
    type: 'object',
    properties: {
      date: { type: 'string', description: '01/2024' },
    },
  },
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        recentTransportRecord: {
          type: 'string',
        },
        recentChamberRecord: {
          type: 'string',
        },
        recentEducationRecord: {
          type: 'string',
        },
        recentHealthRecord: {
          type: 'string',
        },
        totalTransfersInMonth: { type: 'number' },
      },
    },
  },
}

export const AnnualTransfersSchema: FastifySchema = {
  description: 'Get last twelve months transfers',
  tags: ['dashboard'],
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        annualTransfers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              month: { type: 'number' },
              year: { type: 'number' },
              value: { type: 'number' },
            },
          },
        },
        totalTransfersInLastYear: { type: 'number' },
        cached: { type: 'boolean' },
      },
    },
  },
}

export const LastSixMonthsSchema: FastifySchema = {
  description: 'Get last six month records',
  tags: ['dashboard'],
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        lastSixMonthsChamberRecord: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              total: { type: 'string' },
              month: { type: 'number' },
              year: { type: 'number' },
              headcounts: { type: 'number' },
              staffs: { type: 'number' },
              contractors: { type: 'number' },
            },
          },
        },
        lastSixMonthsTransportRecord: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              total: { type: 'string' },
              month: { type: 'number' },
              year: { type: 'number' },
              bus: { type: 'number' },
              cars: { type: 'number' },
              machines: { type: 'number' },
            },
          },
        },
        lastSixMonthsEducationRecord: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              schools: { type: 'number' },
              students: { type: 'number' },
              teachers: { type: 'number' },
              total: { type: 'string' },
              month: { type: 'number' },
              year: { type: 'number' },
            },
          },
        },
        lastSixMonthsHealthRecord: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              services: { type: 'number' },
              doctors: { type: 'number' },
              total: { type: 'string' },
              month: { type: 'number' },
              year: { type: 'number' },
            },
          },
        },
      },
    },
  },
}

export const CurrentMonthTransfersSchema: FastifySchema = {
  description: 'GET a fetch transfers',
  tags: ['transfer'],
  response: {
    200: {
      description: 'Successful',
      type: 'object',
      properties: {
        currentMonthTransfers: {
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
