import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users'
import { UserFilters } from '@/utils/filters-type'

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
    const { name, cpf, permission, role } = filters || {}

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

    if (permission) {
      filteredUsers = filteredUsers.filter(
        (user) => user.permission === permission,
      )
    }

    const paginatedUsers = filteredUsers.slice((page - 1) * items, page * items)

    return paginatedUsers
  }

  async delete(id: string) {
    const chamberIndex = this.items.findIndex((item) => item.id === id)

    if (chamberIndex > -1) {
      this.items.splice(chamberIndex, 1)
    }
  }

  async edit(id: string, data: User) {
    const userIndex = this.items.findIndex((item) => item.id === id)

    if (userIndex < 0) {
      return null
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
      chamber_id: data.chamber_id,
      permission: data.permission ?? 'ACCEPTED',
      role: 'ADMIN',
      created_At: new Date(),
    }

    this.items.push(user)

    return user
  }
}
