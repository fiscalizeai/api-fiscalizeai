import { prisma } from '@/lib/prisma'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const metricsQuerySchema = z.object({
    date: z.coerce.string(),
  })

  try {
    const { date: dateString } = metricsQuerySchema.parse(request.query)
    const [month, year] = dateString.split('/')
    const fomattedDate = new Date(`${month}-01-${year}`)

    const { city } = request.user

    if (!city) {
      throw new InvalidUserOrCityError()
    }

    const recentTransportRecord = await prisma.transport.findFirst({
      where: {
        city_id: city,
        month: fomattedDate.getMonth() + 1,
        year: fomattedDate.getFullYear(),
      },
    })

    const recentEducationRecord = await prisma.education.findFirst({
      where: {
        city_id: city,
        month: fomattedDate.getMonth() + 1,
        year: fomattedDate.getFullYear(),
      },
    })

    const recentChamberRecord = await prisma.chamber.findFirst({
      where: {
        city_id: city,
        month: fomattedDate.getMonth() + 1,
        year: fomattedDate.getFullYear(),
      },
    })

    const recentHealthRecord = await prisma.health.findFirst({
      where: {
        city_id: city,
        month: fomattedDate.getMonth() + 1,
        year: fomattedDate.getFullYear(),
      },
    })

    const totalMonthSpending =
      (recentHealthRecord?.total ?? 0) +
      (recentChamberRecord?.total ?? 0) +
      (recentEducationRecord?.total ?? 0) +
      (recentTransportRecord?.total ?? 0)

    return reply.status(200).send({
      recentTransportRecord,
      recentChamberRecord,
      recentEducationRecord,
      recentHealthRecord,
      totalMonthSpending,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({
        message: 'Validation Error.',
        issues: error.errors,
      })
    }

    if (error instanceof InvalidUserOrCityError) {
      reply.status(404).send({
        message: error.message,
      })
    }
  }
}
