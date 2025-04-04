import { prisma } from '@/lib/prisma'
import { formatDateForWriteInBanking } from '@/utils/format-date-for-write-in-banking'
import { getDatasWebBanking } from '@/utils/get-datas-web-banking'
import { City } from '@prisma/client'

async function processCities(cities: City[]) {
  const date = formatDateForWriteInBanking(new Date())

  for (const city of cities) {
    try {
      const transfers = await getDatasWebBanking(city.id, city.name, date)

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
    const cities = await prisma.city.findMany()

    if (cities.length === 0) {
      throw new Error('Nenhuma cidade encontrada')
    }

    await processCities(cities)
  } catch (error) {
    console.error(error)
  }
}

scraping()
