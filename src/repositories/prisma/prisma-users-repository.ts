import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '../users'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async delete(id: string) {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async edit(id: string, data: Prisma.UserUncheckedUpdateInput) {
    const user = await prisma.user.update({
      where: { id },
      data,
    })

    return user
  }

  async searchByName(query: string, page: number) {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return users
  }

  async fetchByChamber(chamberId: string, page: number) {
    const users = await prisma.user.findMany({
      where: {
        chamber_id: chamberId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return users
  }

  async findByCpf(cpf: string) {
    const user = await prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
