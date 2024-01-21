import { Prisma, Education, City, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EducationRecordsRepository } from '../education'
import { isSameMonth, isSameYear } from 'date-fns'

export class InMemoryEducationRecordsRepository
  implements EducationRecordsRepository
{
  public items: Education[] = []
  public citys: City[] = []
  public users: User[] = []

  async register(data: Prisma.EducationUncheckedCreateInput) {
    const education_record: Education = {
      id: data.id ?? randomUUID(),
      month: new Date(data.month),
      schools: data.schools,
      students: data.schools,
      teachers: data.teachers,
      total: data.total,
      city_id: data.city_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(education_record)

    return education_record
  }

  async findByMonthAndYear(date: Date) {
    const education_record = this.items.find(
      (item) => isSameMonth(item.month, date) && isSameYear(item.month, date),
    )

    if (!education_record) {
      return null
    }

    return education_record
  }

  async fetch(page: number, cityId: string, items = 20, date?: Date) {
    let filteredEducationRecords = this.items.filter(
      (educationRecord) => educationRecord.city_id === cityId,
    )

    if (!filteredEducationRecords) {
      return null
    }

    if (date) {
      filteredEducationRecords = filteredEducationRecords.filter(
        (educationRecord) =>
          isSameMonth(educationRecord.month, date) &&
          isSameYear(educationRecord.month, date),
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
