import { prisma } from '@/lib/prisma'
import { TransferRepository } from '../transfer'
import { TransferFilters } from '@/utils/filters-type'

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
      where: {
        id,
      },
    })

    return transfer
  }
}
