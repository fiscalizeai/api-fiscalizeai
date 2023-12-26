import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { DeleteChamberUseCase } from '@/use-cases/chambers/delete'

export function makeDeleteUseCase() {
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new DeleteChamberUseCase(chambersRepository)

  return useCase
}
