import { Education, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { EducationRecordsRepository } from '../education'
import { startOfMonth, endOfMonth } from 'date-fns'

export class PrismaEducationRecordsRepository
  implements EducationRecordsRepository
{
  async register(data: Prisma.EducationUncheckedCreateInput) {
    const education_record = await prisma.education.create({
      data,
    })

    return education_record
  }

  async edit(id: string, data: Education) {
    const education_record = await prisma.education.update({
      where: { id },
      data,
    })

    return education_record
  }

  async findById(id: string) {
    const education_record = await prisma.education.findUnique({
      where: {
        id,
      },
    })

    return education_record
  }

  async findByMonthAndYear(date: Date) {
    const startOfMonthDate = startOfMonth(date)
    const endOfMonthDate = endOfMonth(date)

    const education_record = await prisma.education.findFirst({
      where: {
        month: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
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
    const education_records = await prisma.education.findMany({
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

    return education_records
  }
}
