import { Prisma, Health, City, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { HealthRecordsRepository } from '../health' // Troquei de "education" para "health"

export class InMemoryHealthRecordsRepository
  implements HealthRecordsRepository
{
  public items: Health[] = []
  public cities: City[] = []
  public users: User[] = []

  async register(data: Prisma.HealthUncheckedCreateInput) {
    const health_record: Health = {
      id: data.id ?? randomUUID(),
      month: data.month,
      year: data.year,
      doctors: data.doctors,
      services: data.services,
      total: data.total,
      city_id: data.city_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(health_record)

    return health_record
  }

  async findByMonthAndYear(month: number, year: number) {
    const health_record = this.items.find(
      (item) => item.month === month && item.year === year,
    )

    if (!health_record) {
      return null
    }

    return health_record
  }

  async fetch(
    page: number,
    cityId: string,
    items = 20,
    month?: number,
    year?: number,
  ) {
    let filteredHealthRecords = this.items.filter(
      (healthRecord) => healthRecord.city_id === cityId,
    )

    if (!filteredHealthRecords) {
      return null
    }

    if (year) {
      filteredHealthRecords = filteredHealthRecords.filter(
        (healthRecord) => healthRecord.year === year,
      )
    }

    if (month) {
      filteredHealthRecords = filteredHealthRecords.filter(
        (healthRecord) => healthRecord.month === month,
      )
    }

    const paginatedHealthRecords = filteredHealthRecords.slice(
      (page - 1) * items,
      page * items,
    )

    const totalItems = filteredHealthRecords.length
    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalPages % items : items

    return {
      health: paginatedHealthRecords,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
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
