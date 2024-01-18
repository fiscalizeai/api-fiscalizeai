import { Prisma, Person, Chamber, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { PersonRecordsRepository } from '../person'
import { isSameMonth, isSameYear } from 'date-fns'

export class InMemoryPersonRecordsRepository
  implements PersonRecordsRepository
{
  public items: Person[] = []
  public chambers: Chamber[] = []
  public users: User[] = []

  async register(data: Prisma.PersonUncheckedCreateInput) {
    const person_record: Person = {
      id: data.id ?? randomUUID(),
      month: new Date(data.month),
      contractors: data.contractors,
      headcounts: data.headcounts,
      staffs: data.staffs,
      total: data.total,
      chamber_id: data.chamber_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(person_record)

    return person_record
  }

  async findByMonthAndYear(date: Date) {
    const person_record = this.items.find(
      (item) => isSameMonth(item.month, date) && isSameYear(item.month, date),
    )

    if (!person_record) {
      return null
    }

    return person_record
  }

  async fetch(page: number, chamberId: string, items = 20, date?: Date) {
    let filteredPersonRecords = this.items.filter(
      (personRecord) => personRecord.chamber_id === chamberId,
    )

    if (!filteredPersonRecords) {
      return null
    }

    if (date) {
      filteredPersonRecords = filteredPersonRecords.filter(
        (personRecord) =>
          isSameMonth(personRecord.month, date) &&
          isSameYear(personRecord.month, date),
      )
    }

    const paginatedPersonRecords = filteredPersonRecords.slice(
      (page - 1) * items,
      page * items,
    )

    return paginatedPersonRecords
  }

  async edit(personId: string, data: Person) {
    const personRecordIndex = this.items.findIndex(
      (item) => item.id === personId,
    )

    if (personRecordIndex < 0) {
      return null
    }

    const updatedPersonRecord = {
      ...this.items[personRecordIndex],
      ...data,
    }

    return updatedPersonRecord
  }

  async findById(id: string) {
    const personRecord = this.items.find((item) => item.id === id)

    if (!personRecord) {
      return null
    }

    return personRecord
  }

  async delete(id: string) {
    const personRecordIndex = this.items.findIndex((item) => item.id === id)

    if (personRecordIndex > -1) {
      this.items.splice(personRecordIndex, 1)
    }
  }
}
