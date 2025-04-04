import { Prisma, City, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import { CityFilters } from '@/utils/filters-type'
import { CitiesRepository } from '../cities'

export class InMemoryCitiesRepository implements CitiesRepository {
  public items: City[] = []
  public users: User[] = []

  async findById(id: string) {
    const city = this.items.find((item) => item.id === id)

    if (!city) {
      return null
    }

    return city
  }

  async fetch(page: number, items = 20, filters?: CityFilters) {
    const { name, state } = filters || {}

    let filteredCities = this.items

    if (state) {
      filteredCities = filteredCities.filter((city) =>
        city.state.toLocaleLowerCase().includes(state.toLocaleLowerCase()),
      )
    }

    if (name) {
      filteredCities = filteredCities.filter((city) =>
        city.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
      )
    }
    const totalItems = filteredCities.length
    const paginatedCities = filteredCities.slice(
      (page - 1) * items,
      page * items,
    )
    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalPages % items : items

    return {
      cities: paginatedCities,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }

  async findByName(name: string, state: string) {
    const city = this.items.find(
      (item) =>
        item.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()) &&
        item.state === state,
    )

    if (!city) {
      return null
    }

    return city
  }

  async edit(id: string, data: City) {
    const cityIndex = this.items.findIndex((item) => item.id === id)

    if (cityIndex < 0) {
      return null
    }

    const updatedCity = { ...this.items[cityIndex], ...data }

    return updatedCity
  }

  async delete(id: string) {
    const cityIndex = this.items.findIndex((item) => item.id === id)

    if (cityIndex > -1) {
      this.items.splice(cityIndex, 1)
    }
  }

  async create(data: Prisma.CityCreateInput) {
    const city: City = {
      id: data.id ?? randomUUID(),
      name: data.name,
      state: data.state,
      created_at: new Date(),
    }

    this.items.push(city)

    return city
  }

  async countUsersByCity(id: string) {
    let count = 0

    this.users.forEach((user) => {
      if (user.city_id === id) {
        count += 1
      }
    })

    return count
  }

  async fetchUserInCity(id: string) {
    const users = this.users.filter((item) => item.city_id === id)

    return users
  }
}
