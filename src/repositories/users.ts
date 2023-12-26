import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByCpf(cpf: string): Promise<User | null>
  searchByName(query: string, page: number): Promise<User[]>
  fetchByChamber(chamberId: string, page: number): Promise<User[]>
  edit(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User | null>
}
