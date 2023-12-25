import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { FetchChambersUseCase } from '@/use-cases/chambers/fetch-chambers'

export function makeFetchUseCase() {
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new FetchChambersUseCase(chambersRepository)

  return useCase
}
