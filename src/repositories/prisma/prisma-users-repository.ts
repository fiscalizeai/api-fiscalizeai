import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '../users'
import { UserFilters } from '@/utils/filters-type'

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

  async fetch(page: number, items: number, filters?: UserFilters) {
    const { city, name, status, role, state } = filters || {}

    const totalItems = await prisma.user.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        city: {
          name: city ? { contains: city, mode: 'insensitive' } : undefined,
          state: state ? { contains: state, mode: 'insensitive' } : undefined,
        },
        status,
        role,
      },
    })

    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        city: {
          name: city ? { contains: city, mode: 'insensitive' } : undefined,
          state: state ? { contains: state, mode: 'insensitive' } : undefined,
        },
        status,
        role,
      },
      take: items,
      skip: (page - 1) * items,
    })
    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalItems % items : items

    return {
      users,
      pagination: { totalItems, pageSize: items, pageNumber: page, pageItems },
    }
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
