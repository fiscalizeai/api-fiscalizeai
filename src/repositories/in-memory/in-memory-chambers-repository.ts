import { Prisma, Chamber } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ChambersRepository } from '../chambers'

export class InMemoryChambersRepository implements ChambersRepository {
  public items: Chamber[] = []

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

  async findByState(state: string, page: number) {
    const chambers = this.items
      .filter((item) =>
        item.state.toLocaleLowerCase().includes(state.toLocaleLowerCase()),
      )
      .slice((page - 1) * 20, page * 20)

    return chambers
  }

  async findById(id: string) {
    const chamber = this.items.find((item) => item.id === id)

    if (!chamber) {
      return null
    }

    return chamber
  }

  async fetch(page: number) {
    const chambers = this.items.slice((page - 1) * 20, page * 20)

    return chambers
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
      created_At: new Date(),
    }

    this.items.push(chamber)

    return chamber
  }
}
