import { City, Prisma } from '@prisma/client'
import { CitiesRepository } from '../cities'
import { prisma } from '@/lib/prisma'
import { CityFilters } from '@/utils/filters-type'
import removeAccents from 'remove-accents'

export class PrismaCitiesRepository implements CitiesRepository {
  async create(data: Prisma.CityCreateInput) {
    console.log(data.name)
    const city = await prisma.city.create({
      data,
    })

    return city
  }

  async delete(id: string) {
    await prisma.city.delete({
      where: {
        id,
      },
    })
  }

  async edit(id: string, data: City) {
    const city = await prisma.city.update({
      where: { id },
      data,
    })

    return city
  }

  async fetch(page: number, items: number, filters?: CityFilters) {
    const { name, state } = filters || {}

    const totalItems = await prisma.city.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        state: state ? { contains: state, mode: 'insensitive' } : undefined,
      },
    })

    const cities = await prisma.city.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        state: state ? { contains: state, mode: 'insensitive' } : undefined,
      },
      orderBy: [{ state: 'asc' }, { name: 'asc' }],
      take: items,
      skip: (page - 1) * items,
    })
    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalItems % items : items

    return {
      cities,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }

  async findByName(name: string, state: string) {
    const normalizeName = removeAccents(name.toLocaleLowerCase())
    const city = await prisma.city.findFirst({
      where: {
        name: { contains: normalizeName, mode: 'insensitive' },
        state,
      },
    })
    return city
  }

  async findById(id: string) {
    const city = await prisma.city.findUnique({
      where: {
        id,
      },
    })

    return city
  }

  async countUsersByCity(id: string) {
    const count = await prisma.user.count({
      where: {
        city_id: id,
      },
    })

    return count
  }

  async fetchUserInCity(id: string) {
    const users = await prisma.user.findMany({
      where: {
        city_id: id,
      },
    })

    return users
  }
}
