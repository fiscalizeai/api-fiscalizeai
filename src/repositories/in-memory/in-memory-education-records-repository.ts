import { Prisma, Education, Chamber, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EducationRecordsRepository } from '../education'

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
}
