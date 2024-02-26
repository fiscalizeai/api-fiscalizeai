import { prisma } from '@/lib/prisma'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { subMonths } from 'date-fns'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function LastSixMonthsTransfers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  // Calcula o ano e o mês há 6 meses atrás
  const lastYearDate = subMonths(currentDate, 5)
  const lastYear = lastYearDate.getFullYear()
  const lastMonth = lastYearDate.getMonth() + 1

  try {
    const { city } = request.user

    if (!city) {
      throw new InvalidUserOrCityError()
    }

    const lastSixMonthsTransportRecord = await prisma.transport.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        AND: [
          {
            OR: [
              // Busca pelos registros do ano e mês atual
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
              // Busca pelos registros do ano anterior
              {
                AND: [{ year: lastYear }, { month: { gte: lastMonth } }],
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        month: true,
        year: true,
        total: true,
        bus: true,
        cars: true,
        machines: true,
      },
    })

    const lastSixMonthsHealthRecord = await prisma.health.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        AND: [
          {
            OR: [
              // Busca pelos registros do ano e mês atual
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
              // Busca pelos registros do ano anterior
              {
                AND: [{ year: lastYear }, { month: { gte: lastMonth } }],
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        month: true,
        year: true,
        total: true,
        doctors: true,
        services: true,
      },
    })

    const lastSixMonthsEducationRecord = await prisma.education.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        AND: [
          {
            OR: [
              // Busca pelos registros do ano e mês atual
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
              // Busca pelos registros do ano anterior
              {
                AND: [{ year: lastYear }, { month: { gte: lastMonth } }],
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        month: true,
        year: true,
        total: true,
        schools: true,
        teachers: true,
        students: true,
      },
    })

    const lastSixMonthsChamberRecord = await prisma.chamber.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        AND: [
          {
            OR: [
              // Busca pelos registros do ano e mês atual
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
              // Busca pelos registros do ano anterior
              {
                AND: [{ year: lastYear }, { month: { gte: lastMonth } }],
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        month: true,
        year: true,
        total: true,
        headcounts: true,
        staffs: true,
        contractors: true,
      },
    })

    return reply.status(200).send({
      lastSixMonthsChamberRecord,
      lastSixMonthsEducationRecord,
      lastSixMonthsHealthRecord,
      lastSixMonthsTransportRecord,
    })
  } catch (error) {
    if (error instanceof InvalidUserOrCityError) {
      reply.status(404).send({
        message: error.message,
      })
    }
  }
}
