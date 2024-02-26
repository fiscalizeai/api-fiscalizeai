import { Chamber, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ChamberRecordsRepository } from '../chamber'

export class PrismaChamberRecordsRepository
  implements ChamberRecordsRepository
{
  async register(data: Prisma.ChamberUncheckedCreateInput) {
    const chamber_record = await prisma.chamber.create({
      data,
    })

    return chamber_record
  }

  async delete(id: string) {
    await prisma.chamber.delete({
      where: {
        id,
      },
    })
  }

  async edit(id: string, data: Chamber) {
    const updatedData = {
      ...data,
      updated_at: new Date(),
    }

    const chamber_record = await prisma.chamber.update({
      where: { id },
      data: updatedData,
    })

    return chamber_record
  }

  async findById(id: string) {
    const chamber_record = await prisma.chamber.findUnique({
      where: {
        id,
      },
    })

    return chamber_record
  }

  async findByMonthAndYear(month: number, year: number) {
    const chamber_record = await prisma.chamber.findFirst({
      where: {
        AND: [{ month }, { year }],
      },
    })

    return chamber_record
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

    const totalItems = await prisma.chamber.count({
      where: whereConditions,
    })

    const chamber = await prisma.chamber.findMany({
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
      chamber,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }
}
