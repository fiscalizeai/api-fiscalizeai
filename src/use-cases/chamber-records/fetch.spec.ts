import { expect, it, describe, beforeEach } from 'vitest'
import { FetchChamberRecordsUseCase } from './fetch'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InMemoryChamberRecordsRepository } from '@/repositories/in-memory/in-memory-chamber-records'

let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let chamberRecordsRepository: InMemoryChamberRecordsRepository
let sut: FetchChamberRecordsUseCase

describe('Fetch Chamber Records Use Case', () => {
  beforeEach(async () => {
    chamberRecordsRepository = new InMemoryChamberRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new FetchChamberRecordsUseCase(chamberRecordsRepository)

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

  it('should be able fetch chamber records', async () => {
    for (let i = 1; i <= 22; i++) {
      await chamberRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: 1,
        year: 2024,
        contractors: parseInt(`${i}`),
        headcounts: parseInt(`${i}`),
        staffs: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    for (let i = 1; i <= 5; i++) {
      await chamberRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: 2,
        year: 2024,
        contractors: parseInt(`${i}`),
        headcounts: parseInt(`${i}`),
        staffs: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    const { chamber } = await sut.execute({
      page: 2,
      cityId: 'city-01',
      items: 20,
      month: 1,
    })

    expect(chamber).toHaveLength(2)
  })
})
