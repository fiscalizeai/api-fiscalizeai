import { prisma } from '@/lib/prisma'
import { FinancesRepository } from '../finance'
import { Prisma } from '@prisma/client'

interface WhereConditionsProps {
  city_id: string
  month?: number
  year?: number
  items?: number
}

export class PrismaFinancesRepository implements FinancesRepository {
  async register(data: Prisma.FinanceUncheckedCreateInput) {
    const finance = await prisma.finance.create({
      data,
    })

    return finance
  }

  async edit(id: string, data: Prisma.FinanceUncheckedUpdateInput) {
    const finance = await prisma.finance.update({
      where: { id },
      data,
    })

    return finance
  }

  async fetch(
    page: number,
    cityId: string,
    items: number,
    month?: number,
    year?: number,
  ) {
    const whereConditions: WhereConditionsProps = {
      city_id: cityId,
    }

    if (month !== undefined) {
      whereConditions.month = month
    }

    if (year !== undefined) {
      whereConditions.year = year
    }

    const totalItems = await prisma.finance.count({
      where: whereConditions,
    })

    const finances = await prisma.finance.findMany({
      where: {
        city_id: cityId,
        AND: [{ month, year }],
      },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
      take: items,
      skip: (page - 1) * items,
    })

    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalItems % items : items

    return {
      finances,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }

  async findByMonthAndYear(month: number, year: number) {
    const finance = await prisma.finance.findFirst({
      where: {
        AND: [{ month }, { year }],
      },
    })

    return finance
  }

  async findById(id: string) {
    const finance = await prisma.finance.findUnique({
      where: {
        id,
      },
    })

    return finance
  }

  async delete(id: string) {
    await prisma.finance.delete({
      where: {
        id,
      },
    })
  }
}
