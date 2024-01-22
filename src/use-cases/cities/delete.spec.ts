import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { DeleteCityUseCase } from './delete'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitysRepository
let sut: DeleteCityUseCase

describe('Delete City Users Use Case', () => {
  beforeEach(async () => {
    citiesRepository = new InMemoryCitysRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteCityUseCase(citiesRepository, usersRepository)

    await citiesRepository.create({
      id: 'city-01',
      name: 'Sacramento',
      state: 'MG',
    })

    await citiesRepository.create({
      id: 'city-02',
      name: 'Uberaba',
      state: 'MG',
    })
  })

  it('should be able delete city', async () => {
    await sut.execute({
      id: 'city-02',
    })

    const cities = await citiesRepository.fetch(1, 10)

    expect(cities).toHaveLength(1)
  })
})
