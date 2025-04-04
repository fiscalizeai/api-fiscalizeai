import { expect, it, describe, beforeEach } from 'vitest'
import { FetchHealthRecordsUseCase } from './fetch'
import { InMemoryHealthRecordsRepository } from '@/repositories/in-memory/in-memory-health-records-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'

let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let healthRecordsRepository: InMemoryHealthRecordsRepository
let sut: FetchHealthRecordsUseCase

describe('Fetch Health Records Use Case', () => {
  beforeEach(async () => {
    healthRecordsRepository = new InMemoryHealthRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new FetchHealthRecordsUseCase(healthRecordsRepository)

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

  it('should be able fetch health records', async () => {
    for (let i = 1; i <= 22; i++) {
      await healthRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: 1,
        year: 2024,
        doctors: parseInt(`${i}`),
        services: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    for (let i = 1; i <= 5; i++) {
      await healthRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: 2,
        year: 2024,
        doctors: parseInt(`${i}`),
        services: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    const { health } = await sut.execute({
      page: 2,
      cityId: 'city-01',
      items: 20,
      month: 1,
    })

    expect(health).toHaveLength(2)
  })
})
