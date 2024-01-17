import { Transport, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth } from 'date-fns'
import { TransportRecordsRepository } from '../transport'

export class PrismaTransportRecordsRepository
  implements TransportRecordsRepository
{
  async register(data: Prisma.TransportUncheckedCreateInput) {
    const transport_record = await prisma.transport.create({
      data,
    })

    return transport_record
  }

  async delete(id: string) {
    await prisma.transport.delete({
      where: {
        id,
      },
    })
  }

  async edit(id: string, data: Transport) {
    const transport_record = await prisma.transport.update({
      where: { id },
      data,
    })

    return transport_record
  }

  async findById(id: string) {
    const transport_record = await prisma.transport.findUnique({
      where: {
        id,
      },
    })

    return transport_record
  }

  async findByMonthAndYear(date: Date) {
    const startOfMonthDate = startOfMonth(date)
    const endOfMonthDate = endOfMonth(date)

    const transport_record = await prisma.transport.findFirst({
      where: {
        month: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    })

    return transport_record
  }

  async fetch(
    page: number,
    chamberId: string,
    items: number,
    date?: Date | undefined,
  ) {
    const transport_records = await prisma.transport.findMany({
      where: {
        chamber_id: chamberId,
        AND: [
          {
            month: {
              gte: date && startOfMonth(date),
              lte: date && endOfMonth(date),
            },
          },
        ],
      },
      take: items,
      skip: (page - 1) * items,
    })

    return transport_records
  }
}
