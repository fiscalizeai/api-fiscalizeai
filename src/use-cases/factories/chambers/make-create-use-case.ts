import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { CreateChamberUseCase } from '@/use-cases/chambers/create'

export function makeCreateUseCase() {
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new CreateChamberUseCase(chambersRepository)

  return useCase
}
