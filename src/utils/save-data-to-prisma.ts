import { prisma } from '@/lib/prisma'
import { getMonth, getYear } from 'date-fns'

interface SubData {
  parcel: string
  value: string
  date: Date
}

interface RowData {
  demonstrative: string
  parcels: SubData[]
  cityId: string
}

export async function saveDataToPrisma(fileName: string, data: RowData[]) {
  for (const row of data) {
    try {
      const existingCity = await prisma.city.findUnique({
        where: { id: row.cityId },
      })

      const existingTransfer = await prisma.transfer.findFirst({
        where: {
          file: fileName,
        },
      })

      if (!existingCity) {
        console.error(`Cidade com ID ${row.cityId} não encontrada.`)
        return
      }

      if (
        existingTransfer?.file === fileName &&
        existingTransfer?.demonstrative === row.demonstrative
      ) {
        console.error(
          `Transferencia ${existingTransfer.demonstrative} da cidade ${existingCity.name} já existe`,
        )
        return
      }

      const transfer = await prisma.transfer.create({
        data: {
          file: fileName,
          demonstrative: row.demonstrative,
          city: { connect: { id: row.cityId } },
        },
      })

      for (const parcel of row.parcels) {
        try {
          const createdParcel = await prisma.parcel.create({
            data: {
              parcel: parcel.parcel,
              value: parcel.value,
              date: parcel.date,
              transfer: { connect: { id: transfer.id } },
            },
          })
          console.log(
            `Parcela ${createdParcel.id} criada para transferência ${transfer.id}`,
          )
        } catch (error) {
          console.error(
            `Erro ao criar parcela para transferência ${transfer.id}:`,
            error,
          )
        }
      }

      let totalValue: number | null = null
      if (row.demonstrative.startsWith('TOTAL DISTRIBUIDO NO PERIODO')) {
        totalValue = parseInt(row.parcels[0].value)
      }

      if (totalValue !== null && !isNaN(totalValue)) {
        const currentDate = new Date()
        const month = getMonth(currentDate) + 1
        const year = getYear(currentDate)

        const existingTotalTransfer = await prisma.totalTransfer.findFirst({
          where: {
            month,
            year,
            city_id: existingCity.id,
          },
        })

        if (existingTotalTransfer) {
          await prisma.totalTransfer.update({
            where: { id: existingTotalTransfer.id },
            data: {
              value: (
                parseInt(existingTotalTransfer.value) + totalValue
              ).toString(),
            },
          })
        } else {
          await prisma.totalTransfer.create({
            data: {
              month,
              year,
              value: totalValue.toString(),
              city: { connect: { id: existingCity.id } },
            },
          })
        }
      }

      console.log(
        `Dados salvos para ${row.demonstrative} na cidade de ${existingCity.name}`,
      )
    } catch (error) {
      console.error(`Erro ao salvar dados para ${row.demonstrative}:`, error)
    }
  }
}
