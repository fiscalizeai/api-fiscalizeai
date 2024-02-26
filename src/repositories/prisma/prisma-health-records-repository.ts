import { Health, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { HealthRecordsRepository } from '../health' // Troquei de "chamber" para "health"

export class PrismaHealthRecordsRepository implements HealthRecordsRepository {
  async register(data: Prisma.HealthUncheckedCreateInput) {
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
    const updatedData = {
      ...data,
      updated_at: new Date(),
    }

    const health_record = await prisma.health.update({
      where: { id },
      data: updatedData,
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

  async findByMonthAndYear(month: number, year: number) {
    const health_record = await prisma.health.findFirst({
      where: {
        AND: [{ month }, { year }],
      },
    })

    return health_record
  }

  async fetch(
    page: number,
    cityId: string,
    items: number,
    month?: number,
    year?: number,
  ) {
    const whereConditions: any = {
      city_id: cityId,
    }

    if (month !== undefined) {
      whereConditions.month = month
    }

    if (year !== undefined) {
      whereConditions.year = year
    }

    const totalItems = await prisma.health.count({
      where: whereConditions,
    })

    const health = await prisma.health.findMany({
      where: {
        city_id: cityId,
        AND: [{ month }, { year }],
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      take: items,
      skip: (page - 1) * items,
    })

    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalItems % items : items

    return {
      health,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }
}
