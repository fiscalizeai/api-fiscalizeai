import { Transport, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
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

  async findByMonthAndYear(month: number, year: number) {
    const transport_record = await prisma.transport.findFirst({
      where: {
        AND: [{ month }, { year }],
      },
    })

    return transport_record
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

    const totalItems = await prisma.transport.count({
      where: whereConditions,
    })

    const transport = await prisma.transport.findMany({
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
      transport,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }
}
