import { CityFilters } from '@/utils/filters-type'
import { Prisma, City, User } from '@prisma/client'

export interface CitiesRepository {
  create(data: Prisma.CityCreateInput): Promise<City>

  findById(id: string): Promise<City | null>

  fetch(
    page: number,
    items?: number,
    filters?: CityFilters,
  ): Promise<{
    cities: City[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  }>

  findByName(name: string, state: string): Promise<City | null>

  edit(id: string, data: Prisma.CityUncheckedCreateInput): Promise<City | null>

  countUsersByCity(id: string): Promise<number>

  fetchUserInCity(id: string): Promise<User[]>

  delete(id: string): Promise<void>
}
