import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users'
import { UserFilters } from '@/utils/filters-type'
import { compare, hash } from 'bcryptjs'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByCpf(cpf: string) {
    const user = this.items.find((item) => item.cpf === cpf)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async fetch(page: number, items = 20, filters?: UserFilters) {
    const { name, cpf, status, role } = filters || {}

    let filteredUsers = this.items

    if (name) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
      )
    }

    if (cpf) {
      filteredUsers = filteredUsers.filter((user) =>
        user.cpf.toLocaleLowerCase().includes(cpf.toLocaleLowerCase()),
      )
    }

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    const totalItems = filteredUsers.length
    const paginatedUsers = filteredUsers.slice((page - 1) * items, page * items)
    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalPages % items : items
    return {
      users: paginatedUsers,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }

  async delete(id: string) {
    const cityIndex = this.items.findIndex((item) => item.id === id)

    if (cityIndex > -1) {
      this.items.splice(cityIndex, 1)
    }
  }

  async edit(id: string, data: User) {
    const userIndex = this.items.findIndex((item) => item.id === id)

    if (userIndex < 0) {
      return null
    }

    if (data.password) {
      data.password = await hash(data.password, 6)
    }

    const updatedUser = { ...this.items[userIndex], ...data }

    return updatedUser
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
    const user: User = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      city_id: data.city_id,
      status: data.status ?? 'ACCEPTED',
      role: 'ADMIN',
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
