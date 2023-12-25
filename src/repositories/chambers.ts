import { Prisma, Chamber } from '@prisma/client'

export interface ChambersRepository {
  create(data: Prisma.ChamberCreateInput): Promise<Chamber>
  findById(id: string): Promise<Chamber | null>
  findByState(state: string, page: number): Promise<Chamber[] | null>
  findByName(name: string, state: string): Promise<Chamber | null>
  edit(
    id: string,
    data: Prisma.ChamberUncheckedUpdateInput,
  ): Promise<Chamber | null>
}
