import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { FetchUseCase } from '@/use-cases/chambers/fetch'

export function makeFetchUseCase() {
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new FetchUseCase(chambersRepository)

  return useCase
}
