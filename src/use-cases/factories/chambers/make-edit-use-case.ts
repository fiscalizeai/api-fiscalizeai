import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { EditChamberUseCase } from '@/use-cases/chambers/edit'

export function makeEditUseCase() {
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new EditChamberUseCase(chambersRepository)

  return useCase
}
