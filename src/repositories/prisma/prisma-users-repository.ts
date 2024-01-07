import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UserFilters, UsersRepository } from '../users'

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

  async fetch(page: number, itemAmount: number, filters?: UserFilters) {
    const { city, name, permission, role, state } = filters || {}
    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        chamber: {
          name: city ? { contains: city, mode: 'insensitive' } : undefined,
          state: state ? { contains: state, mode: 'insensitive' } : undefined,
        },
        permission,
        role,
      },
      take: itemAmount,
      skip: (page - 1) * itemAmount,
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
