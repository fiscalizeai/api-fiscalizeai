import { Prisma, Chamber, City, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ChamberRecordsRepository } from '../chamber'

export class InMemoryChamberRecordsRepository
  implements ChamberRecordsRepository
{
  public items: Chamber[] = []
  public cities: City[] = []
  public users: User[] = []

  async register(data: Prisma.ChamberUncheckedCreateInput) {
    const chamber_record: Chamber = {
      id: data.id ?? randomUUID(),
      month: data.month,
      year: data.year,
      contractors: data.contractors,
      headcounts: data.headcounts,
      staffs: data.staffs,
      total: data.total,
      city_id: data.city_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(chamber_record)

    return chamber_record
  }

  async findByMonthAndYear(month: number, year: number) {
    const chamber_record = this.items.find(
      (item) => item.month === month && item.year === year,
    )

    if (!chamber_record) {
      return null
    }

    return chamber_record
  }

  async fetch(
    page: number,
    cityId: string,
    items = 20,
    month?: number,
    year?: number,
  ) {
    let filteredChamberRecords = this.items.filter(
      (chamberRecord) => chamberRecord.city_id === cityId,
    )

    if (year) {
      filteredChamberRecords = filteredChamberRecords.filter(
        (chamberRecord) => chamberRecord.year === year,
      )
    }

    if (month) {
      filteredChamberRecords = filteredChamberRecords.filter(
        (chamberRecord) => chamberRecord.month === month,
      )
    }

    const paginatedChamberRecords = filteredChamberRecords.slice(
      (page - 1) * items,
      page * items,
    )

    const totalItems = filteredChamberRecords.length
    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalPages % items : items

    return {
      chamber: paginatedChamberRecords,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }

  async edit(chamberId: string, data: Chamber) {
    const chamberRecordIndex = this.items.findIndex(
      (item) => item.id === chamberId,
    )

    if (chamberRecordIndex < 0) {
      return null
    }

    const updatedChamberRecord = {
      ...this.items[chamberRecordIndex],
      ...data,
    }

    return updatedChamberRecord
  }

  async findById(id: string) {
    const chamberRecord = this.items.find((item) => item.id === id)

    if (!chamberRecord) {
      return null
    }

    return chamberRecord
  }

  async delete(id: string) {
    const chamberRecordIndex = this.items.findIndex((item) => item.id === id)

    if (chamberRecordIndex > -1) {
      this.items.splice(chamberRecordIndex, 1)
    }
  }
}
