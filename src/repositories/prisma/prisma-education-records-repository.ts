import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { EducationRecordsRepository } from '../education'
import { startOfMonth } from 'date-fns'

export class PrismaEducationRecordsRepository
  implements EducationRecordsRepository
{
  async register(data: Prisma.EducationUncheckedCreateInput) {
    const education_record = await prisma.education.create({
      data,
    })

    return education_record
  }

  async findByMonthAndYear(date: Date) {
    const startOfMonthDate = startOfMonth(date)

    const education_record = await prisma.education.findFirst({
      where: {
        month: {
          gte: startOfMonthDate,
          lte: startOfMonthDate,
        },
      },
    })

    return education_record
  }

  async fetch(
    page: number,
    chamberId: string,
    items: number,
    date?: Date | undefined,
  ) {
    const startOfMonth = date
      ? new Date(date.getFullYear(), date.getMonth(), 1)
      : undefined
    const endOfMonth = date
      ? new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
      : undefined

    const education_records = await prisma.education.findMany({
      where: {
        chamber_id: chamberId,
        AND: [
          {
            month: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        ],
      },
      take: items,
      skip: (page - 1) * items,
    })

    return education_records
  }
}
