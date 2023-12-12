import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByCpf(cpf: string): Promise<User | null>
  fetchByName(name: string, page: number): Promise<User[] | null>
  fetchByChamber(chamberId: string, page: number): Promise<User[]>
}
