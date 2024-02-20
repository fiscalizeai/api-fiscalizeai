import { prisma } from '@/lib/prisma'
import { FinancesRepository } from '../finance'
import { Prisma } from '@prisma/client'

interface WhereConditionsProps {
  city_id: string
  month?: number
  year?: number
  items?: number
}

interface FetchReturnData {
  id: string
  finance_id: string
  iptu: number
  iss: number
  itbi: number
  month: number
  year: number
  created_at: number
  updated_at: number
  user_id: string
  city_id: string
  value: string
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

    // const finances = await prisma.finance.findMany({
    //   where: {
    //     city_id: cityId,
    //     AND: [{ month, year }],
    //   },
    //   orderBy: [{ year: 'asc' }, { month: 'asc' }],
    //   take: items,
    //   skip: (page - 1) * items,
    // })

    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalItems % items : items

    const itemsPerPage = items // Define o número de itens por página

    const offset = (page - 1) * itemsPerPage

    const finances: FetchReturnData[] = await prisma.$queryRaw`
      SELECT
        f.id AS finance_id,
        f.*, 
        tt.value
      FROM 
        finances_data f
      INNER JOIN 
        total_transfers tt 
      ON 
        f.city_id = tt.city_id
      WHERE 
        f.month = tt.month
        AND f.year = tt.year
      ORDER BY 
        f.year DESC, f.month DESC
      LIMIT 
        ${itemsPerPage}
      OFFSET 
        ${offset};
    `

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
