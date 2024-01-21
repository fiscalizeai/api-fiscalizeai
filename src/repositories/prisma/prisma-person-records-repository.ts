import { Person, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { PersonRecordsRepository } from '../person'
import { startOfMonth, endOfMonth } from 'date-fns'

export class PrismaPersonRecordsRepository implements PersonRecordsRepository {
  async register(data: Prisma.PersonUncheckedCreateInput) {
    const person_record = await prisma.person.create({
      data,
    })

    return person_record
  }

  async delete(id: string) {
    await prisma.person.delete({
      where: {
        id,
      },
    })
  }

  async edit(id: string, data: Person) {
    const person_record = await prisma.person.update({
      where: { id },
      data,
    })

    return person_record
  }

  async findById(id: string) {
    const person_record = await prisma.person.findUnique({
      where: {
        id,
      },
    })

    return person_record
  }

  async findByMonthAndYear(date: Date) {
    const startOfMonthDate = startOfMonth(date)
    const endOfMonthDate = endOfMonth(date)

    const person_record = await prisma.person.findFirst({
      where: {
        month: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    })

    return person_record
  }

  async fetch(
    page: number,
    cityId: string,
    items: number,
    date?: Date | undefined,
  ) {
    const person_records = await prisma.person.findMany({
      where: {
        city_id: cityId,
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

    return person_records
  }
}
