import { Prisma, Chamber, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ChambersRepository } from '../chambers'
import { ChamberFilters } from '@/utils/filters-type'

export class InMemoryChambersRepository implements ChambersRepository {
  public items: Chamber[] = []
  public users: User[] = []

  async findById(id: string) {
    const chamber = this.items.find((item) => item.id === id)

    if (!chamber) {
      return null
    }

    return chamber
  }

  async fetch(page: number, items = 20, filters?: ChamberFilters) {
    const { name, state } = filters || {}

    let filteredChambers = this.items

    if (state) {
      filteredChambers = filteredChambers.filter((chamber) =>
        chamber.state.toLocaleLowerCase().includes(state.toLocaleLowerCase()),
      )
    }

    if (name) {
      filteredChambers = filteredChambers.filter((chamber) =>
        chamber.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
      )
    }

    const paginatedChambers = filteredChambers.slice(
      (page - 1) * items,
      page * items,
    )

    return paginatedChambers
  }

  async findByName(name: string, state: string) {
    const chamber = this.items.find(
      (item) =>
        item.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()) &&
        item.state === state,
    )

    if (!chamber) {
      return null
    }

    return chamber
  }

  async edit(id: string, data: Chamber) {
    const chamberIndex = this.items.findIndex((item) => item.id === id)

    if (chamberIndex < 0) {
      return null
    }

    const updatedChamber = { ...this.items[chamberIndex], ...data }

    return updatedChamber
  }

  async delete(id: string) {
    const chamberIndex = this.items.findIndex((item) => item.id === id)

    if (chamberIndex > -1) {
      this.items.splice(chamberIndex, 1)
    }
  }

  async create(data: Prisma.ChamberCreateInput) {
    const chamber: Chamber = {
      id: data.id ?? randomUUID(),
      name: data.name,
      state: data.state,
      created_at: new Date(),
    }

    this.items.push(chamber)

    return chamber
  }

  async countUsersByChamber(id: string) {
    let count = 0

    this.users.forEach((user) => {
      if (user.chamber_id === id) {
        count += 1
      }
    })

    return count
  }
}
