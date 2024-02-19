import { prisma } from '@/lib/prisma'
import { TransferRepository } from '../transfer'
import { TransferFilters } from '@/utils/filters-type'
import { getMonth, getYear } from 'date-fns'
import {} from '@prisma/client'

export class PrismaTransferRepository implements TransferRepository {
  async fetch(
    page: number,
    cityId: string,
    items: number,
    filters?: TransferFilters,
  ) {
    const { demonstrative } = filters || {}

    const totalItems = await prisma.transfer.count({
      where: {
        city_id: cityId,
        demonstrative: demonstrative
          ? { contains: demonstrative, mode: 'insensitive' }
          : undefined,
      },
    })

    const transfers = await prisma.transfer.findMany({
      include: {
        parcel: true,
      },
      where: {
        city_id: cityId,
        demonstrative: demonstrative
          ? { contains: demonstrative, mode: 'insensitive' }
          : undefined,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: items,
      skip: (page - 1) * items,
    })

    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalItems % items : items

    return {
      transfers,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }

  async findById(id: string) {
    const transfer = await prisma.transfer.findUnique({
      include: {
        parcel: true,
      },
      where: {
        id,
      },
    })

    return transfer
  }

  async totalTransferByMonth(month: Date, cityId: string) {
    const resultMonth = getMonth(month) + 1
    const resultYear = getYear(month)

    const totalTransfer = await prisma.totalTransfer.findFirst({
      where: {
        city_id: cityId,
        month: resultMonth,
        year: resultYear,
      },
    })

    let sum = 0

    if (totalTransfer?.value) {
      sum = parseInt(totalTransfer.value)
    }

    return sum
  }
}
