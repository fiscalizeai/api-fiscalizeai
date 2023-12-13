import { expect, it, describe, beforeEach } from 'vitest'
import { FetchChambersUseCase } from './fetch-chambers'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'

let chamberRepository: InMemoryChambersRepository
let sut: FetchChambersUseCase

describe('Fetch Chambers By State Use Case', () => {
  beforeEach(async () => {
    chamberRepository = new InMemoryChambersRepository()
    sut = new FetchChambersUseCase(chamberRepository)
  })

  it('should be able fetch chambers by state', async () => {
    for (let i = 1; i <= 22; i++) {
      await chamberRepository.create({
        name: `City ${i}`,
        state: 'MG',
      })
    }

    const { chambers } = await sut.execute({
      state: 'MG',
      page: 2,
    })

    expect(chambers).toHaveLength(2)
  })
})
