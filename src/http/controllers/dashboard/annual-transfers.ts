import { prisma } from '@/lib/prisma'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
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
        totalSpendingWithChamber: cachedData.totalSpendingWithChamber,
        totalSpendingWithEducation: cachedData.totalSpendingWithEducation,
        totalSpendingWithHealth: cachedData.totalSpendingWithHealth,
        totalSpendingWithTransport: cachedData.totalSpendingWithTransport,
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
    })

    const totalTransfersInLastYear = annualTransfers.reduce(
      (acc, curr) => acc + parseInt(curr.value),
      0,
    )

    const totalSpendingWithEducation = education.reduce(
      (acc, curr) => acc + parseInt(curr.total.toString()),
      0,
    )

    const totalSpendingWithChamber = chamber.reduce(
      (acc, curr) => acc + parseInt(curr.total.toString()),
      0,
    )

    const totalSpendingWithTransport = transport.reduce(
      (acc, curr) => acc + parseInt(curr.total.toString()),
      0,
    )

    const totalSpendingWithHealth = health.reduce(
      (acc, curr) => acc + parseInt(curr.total.toString()),
      0,
    )

    const totalAmountWithFinance = finance.reduce(
      (acc, curr) =>
        acc +
        (parseInt(curr.iptu.toString()) +
          parseInt(curr.iss.toString()) +
          parseInt(curr.itbi.toString())),
      0,
    )

    const totalSpending =
      totalSpendingWithChamber +
      totalSpendingWithEducation +
      totalSpendingWithHealth +
      totalSpendingWithTransport

    // Armazenar os resultados em cache
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: {
        annualTransfers,
        totalTransfersInLastYear,
        totalSpendingWithHealth,
        totalSpendingWithEducation,
        totalSpendingWithTransport,
        totalSpendingWithChamber,
        totalAmountWithFinance,
      },
    }

    return reply.status(200).send({
      annualTransfers,
      totalSpending,
      totalTransfersInLastYear,
      totalAmountWithFinance,
      totalSpendingWithHealth,
      totalSpendingWithEducation,
      totalSpendingWithTransport,
      totalSpendingWithChamber,
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
