import { expect, it, describe, beforeEach } from 'vitest'
import { FetchPersonRecordsUseCase } from './fetch'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InMemoryPersonRecordsRepository } from '@/repositories/in-memory/in-memory-person-records'

let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let personRecordsRepository: InMemoryPersonRecordsRepository
let sut: FetchPersonRecordsUseCase

describe('Fetch Person Records Use Case', () => {
  beforeEach(async () => {
    personRecordsRepository = new InMemoryPersonRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new FetchPersonRecordsUseCase(personRecordsRepository)

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

  it('should be able fetch person records', async () => {
    for (let i = 1; i <= 22; i++) {
      await personRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: '2024-01',
        contractors: parseInt(`${i}`),
        headcounts: parseInt(`${i}`),
        staffs: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    for (let i = 1; i <= 5; i++) {
      await personRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: '2023-02',
        contractors: parseInt(`${i}`),
        headcounts: parseInt(`${i}`),
        staffs: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    const { personRecords } = await sut.execute({
      page: 2,
      cityId: 'city-01',
      items: 20,
      date: new Date('2024-01'),
    })

    expect(personRecords).toHaveLength(2)
  })
})
