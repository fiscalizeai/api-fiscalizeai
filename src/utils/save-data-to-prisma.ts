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

      if (
        existingTransfer?.file === fileName &&
        existingTransfer?.demonstrative === row.demonstrative
      ) {
        console.error(
          `Transferencia ${existingTransfer.demonstrative} da cidade ${existingCity.name} já existe`,
        )
        return
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
      if (row.demonstrative.startsWith('TOTAL DOS REPASSES NO PERIODO')) {
        totalValue = parseInt(row.parcels[0].value)
      }

      // Verificar se o valor total foi extraído com sucesso
      if (totalValue !== null && !isNaN(totalValue)) {
        const currentDate = new Date()
        const month = getMonth(currentDate) + 1
        const year = getYear(currentDate)

        // Verificar se já existe um registro para o mês e ano correntes na tabela totalTransfer
        const existingTotalTransfer = await prisma.totalTransfer.findFirst({
          where: {
            month,
            year,
            city_id: existingCity.id, // Adicione a condição para a cidade
          },
        })

        if (existingTotalTransfer) {
          // Se já existir um registro, atualizar o valor total
          await prisma.totalTransfer.update({
            where: { id: existingTotalTransfer.id },
            data: {
              value: (
                parseInt(existingTotalTransfer.value) + totalValue
              ).toString(),
            },
          })
        } else {
          // Se não existir, criar um novo registro
          await prisma.totalTransfer.create({
            data: {
              month,
              year,
              value: totalValue.toString(),
              city: { connect: { id: existingCity.id } }, // Conecte a cidade ao registro totalTransfer
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
