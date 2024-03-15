import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { CityNotFoundError } from '@/use-cases/errors/cities/city-not-found'
import { getDatasWebBanking } from '@/utils/get-datas-web-banking'
import { formatDateForWriteInBanking } from '@/utils/format-date-for-write-in-banking'

export async function getTransferInBankByDate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const feedByDateBodySchema = z.object({
    date: z.string(),
  })

  const { date } = feedByDateBodySchema.parse(request.body)

  const cities = await prisma.city.findMany()

  if (!cities) {
    throw new CityNotFoundError()
  }

  const formattedDate = formatDateForWriteInBanking(new Date(date))

  cities.forEach((city) =>
    getDatasWebBanking(city.id, city.name, formattedDate),
  )

  return reply.status(200).send()
}
