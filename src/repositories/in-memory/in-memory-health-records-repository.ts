import { Prisma, Health, Chamber, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { HealthRecordsRepository } from '../health' // Troquei de "education" para "health"
import { isSameMonth, isSameYear } from 'date-fns'

export class InMemoryHealthRecordsRepository
  implements HealthRecordsRepository
{
  public items: Health[] = []
  public chambers: Chamber[] = []
  public users: User[] = []

  async register(data: Prisma.HealthUncheckedCreateInput) {
    const health_record: Health = {
      id: data.id ?? randomUUID(),
      month: new Date(data.month),
      doctors: data.doctors,
      services: data.services,
      total: data.total,
      chamber_id: data.chamber_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(health_record)

    return health_record
  }

  async findByMonthAndYear(date: Date) {
    const health_record = this.items.find(
      (item) => isSameMonth(item.month, date) && isSameYear(item.month, date),
    )

    if (!health_record) {
      return null
    }

    return health_record
  }

  async fetch(page: number, chamberId: string, items = 20, date?: Date) {
    let filteredHealthRecords = this.items.filter(
      (healthRecord) => healthRecord.chamber_id === chamberId,
    )

    if (!filteredHealthRecords) {
      return null
    }

    if (date) {
      filteredHealthRecords = filteredHealthRecords.filter(
        (healthRecord) =>
          isSameMonth(healthRecord.month, date) &&
          isSameYear(healthRecord.month, date),
      )
    }

    const paginatedHealthRecords = filteredHealthRecords.slice(
      (page - 1) * items,
      page * items,
    )

    return paginatedHealthRecords
  }

  async edit(healthId: string, data: Health) {
    const healthRecordIndex = this.items.findIndex(
      (item) => item.id === healthId,
    )

    if (healthRecordIndex < 0) {
      return null
    }

    const updatedHealthRecord = {
      ...this.items[healthRecordIndex],
      ...data,
    }

    return updatedHealthRecord
  }

  async findById(id: string) {
    const healthRecord = this.items.find((item) => item.id === id)

    if (!healthRecord) {
      return null
    }

    return healthRecord
  }

  async delete(id: string) {
    const healthRecordIndex = this.items.findIndex((item) => item.id === id)

    if (healthRecordIndex > -1) {
      this.items.splice(healthRecordIndex, 1)
    }
  }
}
