import { prisma } from '@/lib/prisma'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { calculateMonthlyTotals } from '@/utils/calculate-total-for-month-and-year'
import { subMonths } from 'date-fns'
import { FastifyReply, FastifyRequest } from 'fastify'

// Definir um período de tempo de validade do cache em milissegundos
const CACHE_EXPIRATION_TIME = 2 * 60 * 60 * 1000 // 2 horas em milissegundos

// Criar um objeto para armazenar em cache os resultados das consultas
const cache: { [key: string]: { timestamp: number; data: any } } = {}

export async function annualTransfers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { city } = request.user

    if (!city) {
      throw new InvalidUserOrCityError()
    }

    const cacheKey = `${city}-annualTransfers`

    // Verificar se os dados estão em cache e ainda são válidos
    if (
      cache[cacheKey] &&
      cache[cacheKey].timestamp + CACHE_EXPIRATION_TIME >= Date.now()
    ) {
      const cachedData = cache[cacheKey].data

      return reply.status(200).send({
        annualTransfers: cachedData.annualTransfers,
        totalTransfersInLastYear: cachedData.totalTransfersInLastYear,
        totalSpending: cachedData.totalSpending,
        totalAmountWithFinance: cachedData.totalAmountWithFinance,
        cached: true,
      })
    }

    const annualTransfers = await prisma.totalTransfer.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        city_id: city,
      },
      take: 12,
    })

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    // Calcula o ano e o mês há 12 meses atrás
    const lastYearDate = subMonths(currentDate, 11)
    const lastYear = lastYearDate.getFullYear()
    const lastMonth = lastYearDate.getMonth() + 1

    // Finance
    const finance = await prisma.finance.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        city_id: city,
        AND: [
          {
            OR: [
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
              {
                AND: [{ year: lastYear }, { month: { gte: lastMonth } }],
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        iptu: true,
        iss: true,
        itbi: true,
        month: true,
        year: true,
      },
    })

    // Health Records
    const health = await prisma.health.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        city_id: city,
        AND: [
          {
            OR: [
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
              {
                AND: [{ year: lastYear }, { month: { gte: lastMonth } }],
              },
            ],
          },
        ],
      },
    })

    // Education Records
    const education = await prisma.education.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        city_id: city,
        AND: [
          {
            OR: [
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
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
      },
    })

    // Chamber Records
    const chamber = await prisma.chamber.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        city_id: city,
        AND: [
          {
            OR: [
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
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
      },
    })

    // Transport Records
    const transport = await prisma.transport.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        city_id: city,
        AND: [
          {
            OR: [
              {
                AND: [{ year: currentYear }, { month: { lte: currentMonth } }],
              },
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
      },
    })

    const totalTransfersInLastYear = annualTransfers.reduce(
      (acc, curr) => acc + parseInt(curr.value),
      0,
    )

    const allRecords = [...health, ...education, ...chamber, ...transport]

    // Calcule os totais mensais
    const recordsGroup = calculateMonthlyTotals(allRecords)

    const totalSpending = annualTransfers
      .map((transfer) => {
        return recordsGroup.find(
          (item) =>
            item.month === transfer.month && item.year === transfer.year,
        )
      })
      .filter((item) => item !== undefined)

    const totalAmountWithFinance = finance.map((item) => {
      const total = item.iptu + item.iss + item.itbi
      return {
        id: item.id,
        month: item.month,
        year: item.year,
        total,
      }
    })

    // Armazenar os resultados em cache
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: {
        annualTransfers,
        totalTransfersInLastYear,
        totalSpending,
        totalAmountWithFinance,
      },
    }

    return reply.status(200).send({
      annualTransfers,
      totalSpending,
      totalTransfersInLastYear,
      totalAmountWithFinance,
      cached: false,
    })
  } catch (error) {
    if (error instanceof InvalidUserOrCityError) {
      reply.status(404).send({
        message: error.message,
      })
    }
  }
}
