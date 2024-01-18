import { Health, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { HealthRecordsRepository } from '../health' // Troquei de "person" para "health"
import { startOfMonth, endOfMonth } from 'date-fns'

export class PrismaHealthRecordsRepository implements HealthRecordsRepository {
  async register(data: Prisma.HealthUncheckedCreateInput) {
    // Troquei de "person" para "health"
    const health_record = await prisma.health.create({
      data,
    })

    return health_record
  }

  async delete(id: string) {
    await prisma.health.delete({
      where: {
        id,
      },
    })
  }

  async edit(id: string, data: Health) {
    const health_record = await prisma.health.update({
      where: { id },
      data,
    })

    return health_record
  }

  async findById(id: string) {
    const health_record = await prisma.health.findUnique({
      where: {
        id,
      },
    })

    return health_record
  }

  async findByMonthAndYear(date: Date) {
    const startOfMonthDate = startOfMonth(date)
    const endOfMonthDate = endOfMonth(date)

    const health_record = await prisma.health.findFirst({
      where: {
        month: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    })

    return health_record
  }

  async fetch(
    page: number,
    chamberId: string,
    items: number,
    date?: Date | undefined,
  ) {
    const health_records = await prisma.health.findMany({
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

    return health_records
  }
}
