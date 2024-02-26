import { Prisma, Education, City, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EducationRecordsRepository } from '../education'

export class InMemoryEducationRecordsRepository
  implements EducationRecordsRepository
{
  public items: Education[] = []
  public cities: City[] = []
  public users: User[] = []

  async register(data: Prisma.EducationUncheckedCreateInput) {
    const education_record: Education = {
      id: data.id ?? randomUUID(),
      month: data.month,
      year: data.year,
      schools: data.schools,
      students: data.schools,
      teachers: data.teachers,
      total: BigInt(data.total),
      city_id: data.city_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(education_record)

    return education_record
  }

  async findByMonthAndYear(month: number, year: number) {
    const education_record = this.items.find(
      (item) => item.month === month && item.year === year,
    )

    if (!education_record) {
      return null
    }

    return education_record
  }

  async fetch(
    page: number,
    cityId: string,
    items = 20,
    month?: number,
    year?: number,
  ) {
    let filteredEducationRecords = this.items.filter(
      (educationRecord) => educationRecord.city_id === cityId,
    )

    if (year) {
      filteredEducationRecords = filteredEducationRecords.filter(
        (educationRecord) => educationRecord.year === year,
      )
    }

    if (month) {
      filteredEducationRecords = filteredEducationRecords.filter(
        (educationRecord) => educationRecord.month === month,
      )
    }

    const paginatedEducationRecords = filteredEducationRecords.slice(
      (page - 1) * items,
      page * items,
    )
    const totalItems = filteredEducationRecords.length
    const totalPages = Math.ceil(totalItems / items)
    const pageItems = page === totalPages ? totalPages % items : items

    return {
      education: paginatedEducationRecords,
      pagination: {
        totalItems,
        pageSize: items,
        pageNumber: page,
        pageItems,
      },
    }
  }

  async edit(educationId: string, data: Education) {
    const educationRecordIndex = this.items.findIndex(
      (item) => item.id === educationId,
    )

    if (educationRecordIndex < 0) {
      return null
    }

    const updatedEducationRecord = {
      ...this.items[educationRecordIndex],
      ...data,
    }

    return updatedEducationRecord
  }

  async findById(id: string) {
    const educationRecord = this.items.find((item) => item.id === id)

    if (!educationRecord) {
      return null
    }

    return educationRecord
  }

  async delete(id: string) {
    const educationRecordIndex = this.items.findIndex((item) => item.id === id)

    if (educationRecordIndex > -1) {
      this.items.splice(educationRecordIndex, 1)
    }
  }
}
