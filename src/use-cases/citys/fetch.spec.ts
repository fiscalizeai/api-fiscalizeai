import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-citys-repository'
import { FetchUseCase } from './fetch'

let cityRepository: InMemoryCitysRepository
let sut: FetchUseCase

describe('Fetch Citys Use Case', () => {
  beforeEach(async () => {
    cityRepository = new InMemoryCitysRepository()
    sut = new FetchUseCase(cityRepository)
  })

  it('should be able fetch citys', async () => {
    for (let i = 1; i <= 22; i++) {
      await cityRepository.create({
        name: `City ${i}`,
        state: 'MG',
      })
    }

    const { citys } = await sut.execute({
      page: 2,
    })

    expect(citys).toHaveLength(2)
  })

  it('should be able fetch citys specific filters', async () => {
    for (let i = 1; i <= 22; i++) {
      await cityRepository.create({
        name: `City ${i}`,
        state: 'MG',
      })
    }

    const { citys } = await sut.execute({
      page: 1,
      items: 10,
      name: 'City 2',
    })

    expect(citys).toHaveLength(4)
  })
})
