import { prisma } from '@/lib/prisma'
import { formatDateForWriteInBanking } from '@/utils/format-date-for-write-in-banking'
import { getDatasWebBanking } from '@/utils/get-datas-web-banking'
import { City } from '@prisma/client'

async function processCities(cities: City[]) {
  // Obtendo a data formatada para utilizacao no scraping
  const date = formatDateForWriteInBanking(new Date())
  // Iterando sobre cada cidade
  for (const city of cities) {
    try {
      // Obtendo os dados de transferencia bancaria pra cidade atual
      const transfers = getDatasWebBanking(city.id, city.name, date)
      // Verificando se ha dados de transferencia
      if (transfers === null) {
        return null
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export async function scraping() {
  try {
    // Buscando todas as cidades no banco de dados
    const cities = await prisma.city.findMany()

    // Verificando se ha cidades no banco de dados
    if (cities.length === 0) {
      throw new Error()
    }

    // Execute a função imediatamente para processar as cidades
    await processCities(cities)
  } catch (error) {
    console.error(error)
  }
}

scraping()
