import { Prisma, Person } from '@prisma/client'

export interface PersonRecordsRepository {
  register(data: Prisma.PersonUncheckedCreateInput): Promise<Person>
  findByMonthAndYear(date: Date): Promise<Person | null>
  fetch(
    page: number,
    cityId: string,
    items?: number,
    date?: Date,
  ): Promise<Person[] | null>
  edit(
    personId: string,
    data: Prisma.PersonUncheckedUpdateInput,
  ): Promise<Person | null>
  findById(id: string): Promise<Person | null>
  delete(id: string): Promise<void>
}
