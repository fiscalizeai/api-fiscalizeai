import { Prisma, Transport, Chamber, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { isSameMonth, isSameYear } from 'date-fns'
import { TransportRecordsRepository } from '../transport'

export class InMemoryTransportRecordsRepository
  implements TransportRecordsRepository
{
  public items: Transport[] = []
  public chambers: Chamber[] = []
  public users: User[] = []

  async register(data: Prisma.TransportUncheckedCreateInput) {
    const transport_record: Transport = {
      id: data.id ?? randomUUID(),
      month: new Date(data.month),
      cars: data.cars,
      bus: data.bus,
      machines: data.machines,
      total: data.total,
      chamber_id: data.chamber_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(transport_record)

    return transport_record
  }

  async findByMonthAndYear(date: Date) {
    const transport_record = this.items.find(
      (item) => isSameMonth(item.month, date) && isSameYear(item.month, date),
    )

    if (!transport_record) {
      return null
    }

    return transport_record
  }

  async fetch(page: number, chamberId: string, items = 20, date?: Date) {
    let filteredTransportRecords = this.items.filter(
      (transportRecord) => transportRecord.chamber_id === chamberId,
    )

    if (!filteredTransportRecords) {
      return null
    }

    if (date) {
      filteredTransportRecords = filteredTransportRecords.filter(
        (transportRecord) =>
          isSameMonth(transportRecord.month, date) &&
          isSameYear(transportRecord.month, date),
      )
    }

    const paginatedTransportRecords = filteredTransportRecords.slice(
      (page - 1) * items,
      page * items,
    )

    return paginatedTransportRecords
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
