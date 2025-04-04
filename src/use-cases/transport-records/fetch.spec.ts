import { expect, it, describe, beforeEach } from 'vitest'
import { FetchTransportRecordsUseCase } from './fetch'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InMemoryTransportRecordsRepository } from '@/repositories/in-memory/in-memory-transport-records-repository'

let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let transportRecordsRepository: InMemoryTransportRecordsRepository
let sut: FetchTransportRecordsUseCase

describe('Fetch Transport Records Use Case', () => {
  beforeEach(async () => {
    transportRecordsRepository = new InMemoryTransportRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new FetchTransportRecordsUseCase(transportRecordsRepository)

    await citiesRepository.create({
      id: 'city-01',
      name: 'Sacramento',
      state: 'MG',
    })

    await usersRepository.create({
      id: 'user-01',
      email: 'johndoe@example.com',
      name: 'John Doe',
      cpf: 'cpf-user',
      password: 'cpf-user',
      city_id: 'city-01',
    })
  })

  it('should be able fetch transport records', async () => {
    for (let i = 1; i <= 22; i++) {
      await transportRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: 1,
        year: 2024,
        cars: parseInt(`${i}`),
        bus: parseInt(`${i}`),
        machines: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    for (let i = 1; i <= 5; i++) {
      await transportRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: 2,
        year: 2024,
        cars: parseInt(`${i}`),
        bus: parseInt(`${i}`),
        machines: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    const { transport } = await sut.execute({
      page: 2,
      cityId: 'city-01',
      items: 20,
      month: 1,
    })

    expect(transport).toHaveLength(2)
  })
})
