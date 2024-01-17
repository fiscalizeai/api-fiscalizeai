import { Prisma, Transport } from '@prisma/client'

export interface TransportRecordsRepository {
  register(data: Prisma.TransportUncheckedCreateInput): Promise<Transport>
  findByMonthAndYear(date: Date): Promise<Transport | null>
  fetch(
    page: number,
    chamberId: string,
    items?: number,
    date?: Date,
  ): Promise<Transport[] | null>
  edit(
    transportId: string,
    data: Prisma.TransportUncheckedUpdateInput,
  ): Promise<Transport | null>
  findById(id: string): Promise<Transport | null>
  delete(id: string): Promise<void>
}
