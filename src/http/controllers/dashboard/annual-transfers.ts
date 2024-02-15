import { prisma } from '@/lib/prisma'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { startOfMonth, subMonths } from 'date-fns'
import { FastifyReply, FastifyRequest } from 'fastify'

// Definir um período de tempo de validade do cache em milissegundos
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 horas em milissegundos

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

    const annualTransfersFiltered = await prisma.transfer.findMany({
      orderBy: { created_at: 'desc' },
      where: {
        city_id: city,
        demonstrative: 'TOTAL DOS REPASSES NO PERIODO',
        created_at: {
          gte: startOfMonth(lastYearDate), // Data de 12 meses atras
          lte: new Date(), // Data atual
        },
      },
      select: {
        id: true,
        demonstrative: true,
        created_at: true,
        parcel: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    })

    const annualTransfers: TransferYearProps[] = []

    annualTransfersFiltered.forEach((transfer) => {
      // Verifica se já existe uma entrada no array annualTransfers para o mês e ano atual
      const existingEntry = annualTransfers.find(
        (entry) =>
          entry.month === transfer.created_at.getMonth() + 1 &&
          entry.year === transfer.created_at.getFullYear(),
      )

      // Converte o valor para número
      const parcelValue = parseFloat(transfer.parcel[0].value)

      // Se já existe uma entrada, atualiza o valor somando o valor atual do registro
      if (existingEntry) {
        existingEntry.value += parcelValue
      } else {
        // Se não existe uma entrada, cria uma nova entrada no array sumInMonthYear
        annualTransfers.push({
          month: transfer.created_at.getMonth() + 1,
          year: transfer.created_at.getFullYear(),
          value: parcelValue,
        })
      }
    })

    const totalTransfersInLastYear = annualTransfers.reduce(
      (acc, curr) => acc + curr.value,
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
