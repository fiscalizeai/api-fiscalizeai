import { prisma } from '@/lib/prisma'

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
      // Verifique se a cidade existe no Prisma
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

      if (!existingTransfer) {
        console.error(`Transferencia da cidade ${fileName}`)
      }

      // Crie a transferência
      const transfer = await prisma.transfer.create({
        data: {
          file: fileName,
          demonstrative: row.demonstrative,
          city: { connect: { id: row.cityId } },
        },
      })

      // Crie as parcelas associadas à transferência
      await Promise.all(
        row.parcels.map(async (parcel) => {
          await prisma.parcel.create({
            data: {
              parcel: parcel.parcel,
              value: parcel.value,
              date: parcel.date,
              transfer: { connect: { id: transfer.id } },
            },
          })
        }),
      )

      console.log(`Dados salvos para ${row.demonstrative}`)
    } catch (error) {
      console.error(`Erro ao salvar dados para ${row.demonstrative}:`, error)
    }
  }
}
