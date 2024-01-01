import { PrismaChambersRepository } from '@/repositories/prisma/prisma-chambers-repository'
import { FetchByStateUseCase } from '@/use-cases/chambers/fetch-by-state'

export function makeFetchByStateUseCase() {
  const chambersRepository = new PrismaChambersRepository()
  const useCase = new FetchByStateUseCase(chambersRepository)

  return useCase
}
