import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { FetchUseCase } from './fetch'

let cityRepository: InMemoryCitysRepository
let sut: FetchUseCase

describe('Fetch Citys Use Case', () => {
  beforeEach(async () => {
    cityRepository = new InMemoryCitysRepository()
    sut = new FetchUseCase(cityRepository)
  })

  it('should be able fetch cities', async () => {
    for (let i = 1; i <= 22; i++) {
      await cityRepository.create({
        name: `City ${i}`,
        state: 'MG',
      })
    }

    const { cities } = await sut.execute({
      page: 2,
    })

    expect(cities).toHaveLength(2)
  })

  it('should be able fetch cities specific filters', async () => {
    for (let i = 1; i <= 22; i++) {
      await cityRepository.create({
        name: `City ${i}`,
        state: 'MG',
      })
    }

    const { cities } = await sut.execute({
      page: 1,
      items: 10,
      name: 'City 2',
    })

    expect(cities).toHaveLength(4)
  })
})
