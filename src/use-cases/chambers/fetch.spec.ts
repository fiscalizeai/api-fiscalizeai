import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { FetchUseCase } from './fetch'

let chamberRepository: InMemoryChambersRepository
let sut: FetchUseCase

describe('Fetch Chambers Use Case', () => {
  beforeEach(async () => {
    chamberRepository = new InMemoryChambersRepository()
    sut = new FetchUseCase(chamberRepository)
  })

  it('should be able fetch chambers', async () => {
    for (let i = 1; i <= 22; i++) {
      await chamberRepository.create({
        name: `City ${i}`,
        state: 'MG',
      })
    }

    const { chambers } = await sut.execute({
      page: 2,
    })

    expect(chambers).toHaveLength(2)
  })
})
