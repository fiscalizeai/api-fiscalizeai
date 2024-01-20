import { ChamberFilters } from '@/utils/filters-type'
import { Prisma, Chamber, User } from '@prisma/client'

export interface ChambersRepository {
  create(data: Prisma.ChamberCreateInput): Promise<Chamber>

  findById(id: string): Promise<Chamber | null>

  fetch(
    page: number,
    items?: number,
    filters?: ChamberFilters,
  ): Promise<{
    chambers: Chamber[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  } | null>

  findByName(name: string, state: string): Promise<Chamber | null>

  edit(
    id: string,
    data: Prisma.ChamberUncheckedCreateInput,
  ): Promise<Chamber | null>

  delete(id: string): Promise<void>

  countUsersByChamber(id: string): Promise<number>

  fetchUserInChamber(id: string): Promise<User[]>
}
