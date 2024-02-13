import { Education, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { EducationRecordsRepository } from '../education'

export class PrismaEducationRecordsRepository
  implements EducationRecordsRepository
{
  async register(data: Prisma.EducationUncheckedCreateInput) {
    const education_record = await prisma.education.create({
      data,
    })

    return education_record
  }

  async delete(id: string) {
    await prisma.education.delete({
      where: {
        id,
      },
    })
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

  async findByMonthAndYear(month: number, year: number) {
    const education_record = await prisma.education.findFirst({
      where: {
        AND: [{ month }, { year }],
      },
    })

    return education_record
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

    const totalItems = await prisma.education.count({
      where: whereConditions,
    })

    const education = await prisma.education.findMany({
      where: {
        city_id: cityId,
        AND: [{ month }, { year }],
      },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
      take: items,
      skip: (page - 1) * items,
    })

    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalItems % items : items

    return {
      education,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }
}
