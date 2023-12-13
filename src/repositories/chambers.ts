import { Prisma, Chamber } from '@prisma/client'

export interface ChambersRepository {
  create(data: Prisma.ChamberCreateInput): Promise<Chamber>
  findByState(state: string, page: number): Promise<Chamber[] | null>
  findByName(name: string, state: string): Promise<Chamber | null>
}
