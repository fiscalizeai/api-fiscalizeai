import { Prisma, Education, Chamber, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EducationRecordsRepository } from '../education'
import { EducationFilters } from '@/utils/filters-type'
import { isSameMonth, isSameYear } from 'date-fns'

export class InMemoryEducationRecordsRepository
  implements EducationRecordsRepository
{
  public items: Education[] = []
  public chambers: Chamber[] = []
  public users: User[] = []

  async register(data: Prisma.EducationUncheckedCreateInput) {
    const education_record: Education = {
      id: data.id ?? randomUUID(),
      month: new Date(data.month),
      schools: data.schools,
      students: data.schools,
      teachers: data.teachers,
      total: data.total,
      chamber_id: data.chamber_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(education_record)

    return education_record
  }

  async findByMonthAndYear(date: Date) {
    const education_record = this.items.find(
      (item) =>
        item.month.getMonth() === date.getMonth() &&
        item.month.getFullYear() === date.getFullYear(),
    )

    if (!education_record) {
      return null
    }

    return education_record
  }

  async fetch(page: number, chamberId: string, items = 20, date?: Date) {
    let filteredEducationRecords = this.items.filter(
      (educationRecord) => educationRecord.chamber_id === chamberId,
    )

    if (!filteredEducationRecords) {
      return null
    }

    if (date) {
      filteredEducationRecords = filteredEducationRecords.filter(
        (educationRecord) =>
          isSameMonth(educationRecord.month, date) &&
          isSameMonth(educationRecord.month, date),
      )
    }

    const paginatedEducationRecords = filteredEducationRecords.slice(
      (page - 1) * items,
      page * items,
    )

    return paginatedEducationRecords
  }
}
