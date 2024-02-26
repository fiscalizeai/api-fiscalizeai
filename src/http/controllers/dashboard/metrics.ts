import { prisma } from '@/lib/prisma'
import { InvalidUserOrCityError } from '@/use-cases/errors/records/invalid-user-or-city'
import { endOfMonth, subMonths } from 'date-fns'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

interface TransferMonthProps {
  month: number
  year: number
  value: number
}

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const metricsQuerySchema = z.object({
    date: z.coerce.string(),
  })

  try {
    const { date: dateString } = metricsQuerySchema.parse(request.query)
    const [month, year] = dateString.split('/')
    const formattedDate = new Date(`${month}-01-${year}`)

    const { city } = request.user

    if (!city) {
      throw new InvalidUserOrCityError()
    }

    // Iniciar uma transação
    const [
      recentTransportRecord,
      recentEducationRecord,
      recentChamberRecord,
      recentHealthRecord,
      totalTransfersInMonth,
    ] = await Promise.all([
      (
        await prisma.transport.findFirst({
          where: {
            city_id: city,
            month: formattedDate.getMonth() + 1,
            year: formattedDate.getFullYear(),
          },
        })
      )?.total || 0,
      (
        await prisma.education.findFirst({
          where: {
            city_id: city,
            month: formattedDate.getMonth() + 1,
            year: formattedDate.getFullYear(),
          },
        })
      )?.total || 0,
      (
        await prisma.chamber.findFirst({
          where: {
            city_id: city,
            month: formattedDate.getMonth() + 1,
            year: formattedDate.getFullYear(),
          },
        })
      )?.total || 0,
      (
        await prisma.health.findFirst({
          where: {
            city_id: city,
            month: formattedDate.getMonth() + 1,
            year: formattedDate.getFullYear(),
          },
        })
      )?.total || 0,
      (await prisma.transfer.findMany({
        orderBy: { created_at: 'desc' },
        where: {
          city_id: city,
          demonstrative: 'TOTAL DOS REPASSES NO PERIODO',
          created_at: {
            gte: subMonths(formattedDate, 0), // Pegar o mes da data
            lte: endOfMonth(formattedDate), // Final do mes
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
      })) || [],
    ])

    const monthTransfers: TransferMonthProps[] = []

    totalTransfersInMonth.forEach((transfer) => {
      const parcelValue = parseFloat(transfer.parcel[0].value)

      const existingEntryIndex = monthTransfers.findIndex(
        (entry) =>
          entry.month === transfer.created_at.getMonth() + 1 &&
          entry.year === transfer.created_at.getFullYear(),
      )

      if (existingEntryIndex !== -1) {
        monthTransfers[existingEntryIndex].value += parcelValue
      } else {
        monthTransfers.push({
          month: transfer.created_at.getMonth() + 1,
          year: transfer.created_at.getFullYear(),
          value: parcelValue,
        })
      }
    })

    return reply.status(200).send({
      recentTransportRecord,
      recentChamberRecord,
      recentEducationRecord,
      recentHealthRecord,
      totalTransfersInMonth: monthTransfers.reduce(
        (acc, curr) => acc + curr.value,
        0,
      ),
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
