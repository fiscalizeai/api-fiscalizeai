import { Prisma, Transport } from '@prisma/client'

export interface TransportRecordsRepository {
  register(data: Prisma.TransportUncheckedCreateInput): Promise<Transport>
  findByMonthAndYear(
    month: number | Prisma.IntFieldUpdateOperationsInput,
    year: number | Prisma.IntFieldUpdateOperationsInput,
    cityId: string,
  ): Promise<Transport | null>
  fetch(
    page: number,
    cityId: string,
    items?: number,
    month?: number,
    year?: number,
  ): Promise<{
    transport: Transport[]
    pagination: {
      totalItems: number
      pageSize: number
      pageNumber: number
      pageItems: number
    }
  }>
  edit(
    transportId: string,
    data: Prisma.TransportUncheckedUpdateInput,
  ): Promise<Transport | null>
  findById(id: string): Promise<Transport | null>
  delete(id: string): Promise<void>
}
