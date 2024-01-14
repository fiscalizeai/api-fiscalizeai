import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { GetChamberByIdUseCase } from '@/use-cases/chambers/get-by-id'

export function makeGetByIdUseCase() {
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new GetChamberByIdUseCase(chambersRepository)

  return useCase
}
