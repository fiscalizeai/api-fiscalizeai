import { prisma } from '@/lib/prisma'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { startOfMonth, subMonths } from 'date-fns'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function currentMonthTransfers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { city } = request.user
    const currentDate = new Date()
    const currentMonth = subMonths(currentDate, 0)

    if (!city) {
      throw new InvalidUserOrCityError()
    }

    const currentMonthTransfers = await prisma.transfer.findMany({
      orderBy: { created_at: 'desc' },
      where: {
        city_id: city,
        created_at: {
          gte: startOfMonth(currentMonth), // Data desse mes
          lte: new Date(), // Data atual
        },
      },
      include: {
        parcel: true,
      },
    })

    return reply.status(200).send({
      currentMonthTransfers,
    })
  } catch (error) {
    if (error instanceof InvalidUserOrCityError) {
      reply.status(404).send({
        message: error.message,
      })
    }
  }
}
