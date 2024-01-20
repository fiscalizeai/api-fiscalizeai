import { edit } from '@/http/controllers/users/edit'
import { UserFilters } from '@/utils/filters-type'
import { Prisma, User } from '@prisma/client'
import { number, string } from 'zod'

export interface UsersRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByCpf(cpf: string): Promise<User | null>
  fetch(
    page: number,
    items?: number,
    filters?: UserFilters,
  ): Promise<{
    users: User[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  } | null>
  edit(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User | null>
  delete(id: string): Promise<void>
}
