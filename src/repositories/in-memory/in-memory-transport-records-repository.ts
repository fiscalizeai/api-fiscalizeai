import { Prisma, Transport, City, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { TransportRecordsRepository } from '../transport'

export class InMemoryTransportRecordsRepository
  implements TransportRecordsRepository
{
  public items: Transport[] = []
  public cities: City[] = []
  public users: User[] = []

  async register(data: Prisma.TransportUncheckedCreateInput) {
    const transport_record: Transport = {
      id: data.id ?? randomUUID(),
      month: data.month,
      year: data.year,
      cars: data.cars,
      bus: data.bus,
      machines: data.machines,
      total: data.total,
      city_id: data.city_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(transport_record)

    return transport_record
  }

  async findByMonthAndYear(month: number, year: number) {
    const transport_record = this.items.find(
      (item) => item.month === month && item.year === year,
    )

    if (!transport_record) {
      return null
    }

    return transport_record
  }

  async fetch(
    page: number,
    cityId: string,
    items = 20,
    month?: number,
    year?: number,
  ) {
    let filteredTransportRecords = this.items.filter(
      (transportRecord) => transportRecord.city_id === cityId,
    )

    if (year) {
      filteredTransportRecords = filteredTransportRecords.filter(
        (transportRecord) => transportRecord.year === year,
      )
    }

    if (month) {
      filteredTransportRecords = filteredTransportRecords.filter(
        (transportRecord) => transportRecord.month === month,
      )
    }

    const paginatedTransportRecords = filteredTransportRecords.slice(
      (page - 1) * items,
      page * items,
    )

    const totalItems = filteredTransportRecords.length
    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalPages % items : items

    return {
      transport: paginatedTransportRecords,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }

  async edit(transportId: string, data: Transport) {
    const transportRecordIndex = this.items.findIndex(
      (item) => item.id === transportId,
    )

    if (transportRecordIndex < 0) {
      return null
    }

    const updatedtransportRecord = {
      ...this.items[transportRecordIndex],
      ...data,
    }

    return updatedtransportRecord
  }

  async findById(id: string) {
    const transportRecord = this.items.find((item) => item.id === id)

    if (!transportRecord) {
      return null
    }

    return transportRecord
  }

  async delete(id: string) {
    const transportRecordIndex = this.items.findIndex((item) => item.id === id)

    if (transportRecordIndex > -1) {
      this.items.splice(transportRecordIndex, 1)
    }
  }
}
