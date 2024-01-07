import { Permission, Prisma, Role, User } from '@prisma/client'

export interface UserFilters {
  name?: string
  cpf?: string
  city?: string
  state?: string
  role?: Role
  permission?: Permission
}

export interface UsersRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByCpf(cpf: string): Promise<User | null>
  fetch(
    page: number,
    items?: number,
    filters?: UserFilters,
  ): Promise<User[] | null>
  edit(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User | null>
  delete(id: string): Promise<void>
}
