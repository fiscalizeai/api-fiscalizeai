import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { EducationRecordsRepository } from '../education'

export class PrismaEducationRecordsRepository
  implements EducationRecordsRepository
{
  async register(data: Prisma.EducationUncheckedCreateInput) {
    const education_record = await prisma.education.create({
      data,
    })

    return education_record
  }
}
