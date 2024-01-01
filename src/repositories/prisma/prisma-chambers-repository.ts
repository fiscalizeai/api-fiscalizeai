import { Chamber, Prisma } from '@prisma/client'
import { ChambersRepository } from '../chambers'
import { prisma } from '@/lib/prisma'

export class PrismaChambersRepository implements ChambersRepository {
  async create(data: Prisma.ChamberCreateInput) {
    const chamber = await prisma.chamber.create({
      data,
    })

    return chamber
  }

  async delete(id: string) {
    await prisma.chamber.delete({
      where: {
        id,
      },
    })
  }

  async edit(id: string, data: Chamber) {
    const chamber = await prisma.chamber.update({
      where: { id },
      data,
    })

    return chamber
  }

  async fetch(page: number) {
    const chambers = await prisma.chamber.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    return chambers
  }

  async findByName(name: string, state: string) {
    const chamber = await prisma.chamber.findFirst({
      where: {
        name,
        state,
      },
    })
    return chamber
  }

  async findByState(state: string, page: number) {
    const chambers = await prisma.chamber.findMany({
      where: {
        state,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return chambers
  }

  async findById(id: string) {
    const chamber = await prisma.chamber.findUnique({
      where: {
        id,
      },
    })

    return chamber
  }
}
