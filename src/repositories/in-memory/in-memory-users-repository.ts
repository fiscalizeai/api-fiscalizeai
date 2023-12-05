import { $Enums, Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users'

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

  async create(data: Prisma.UserUncheckedCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      chamber_id: data.chamber_id,
      permission: 'ACCEPTED',
      role: 'ADMIN',
      created_At: new Date(),
    }

    this.items.push(user)

    return user
  }
}
