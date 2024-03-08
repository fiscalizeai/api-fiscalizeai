import { prisma } from '@/lib/prisma'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { startOfMonth, subMonths } from 'date-fns'
import { FastifyReply, FastifyRequest } from 'fastify'

// Definir um período de tempo de validade do cache em milissegundos
const CACHE_EXPIRATION_TIME = 2 * 60 * 60 * 1000 // 2 horas em milissegundos

// Criar um objeto para armazenar em cache os resultados das consultas
const cache: { [key: string]: { timestamp: number; data: any } } = {}

interface TransferYearProps {
  month: number
  year: number
  value: number
}

export async function annualTransfers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentDate = new Date()

  // Calcula o ano e o mês há 12 meses atrás
  const lastYearDate = subMonths(currentDate, 12)

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
        cached: true,
      })
    }

    const annualTransfers = await prisma.totalTransfer.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      where: {
        city_id: city,
      },
    })

    const totalTransfersInLastYear = annualTransfers.reduce(
      (acc, curr) => acc + parseInt(curr.value),
      0,
    )

    // Armazenar os resultados em cache
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: {
        annualTransfers,
        totalTransfersInLastYear,
      },
    }

    return reply.status(200).send({
      annualTransfers,
      totalTransfersInLastYear,
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
