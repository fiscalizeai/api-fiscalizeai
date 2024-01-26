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
          type: 'object',
          properties: {
            id: { type: 'string' },
            cars: { type: 'number' },
            bus: { type: 'number' },
            machines: { type: 'number' },
            total: { type: 'number' },
            month: { type: 'number' },
            year: { type: 'number' },
            updated_at: { type: 'string' },
          },
        },
        recentChamberRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            staffs: { type: 'number' },
            contractors: { type: 'number' },
            headcounts: { type: 'number' },
            total: { type: 'number' },
            month: { type: 'number' },
            year: { type: 'number' },
            updated_at: { type: 'string' },
          },
        },
        recentEducationRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            schools: { type: 'number' },
            students: { type: 'number' },
            teachers: { type: 'number' },
            total: { type: 'number' },
            month: { type: 'number' },
            year: { type: 'number' },
            updated_at: { type: 'string' },
          },
        },
        recentHealthRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            services: { type: 'number' },
            doctors: { type: 'number' },
            total: { type: 'number' },
            month: { type: 'number' },
            year: { type: 'number' },
            updated_at: { type: 'string' },
          },
        },
        totalMonthSpending: { type: 'number' },
      },
    },
  },
}
