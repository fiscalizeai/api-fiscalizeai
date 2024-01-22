import { expect, it, describe, beforeEach } from 'vitest'
import { FetchEducationRecordsUseCase } from './fetch'
import { InMemoryEducationRecordsRepository } from '@/repositories/in-memory/in-memory-education-records-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-cities-repository'

let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitysRepository
let educationRecordsRepository: InMemoryEducationRecordsRepository
let sut: FetchEducationRecordsUseCase

describe('Fetch Education Records Use Case', () => {
  beforeEach(async () => {
    educationRecordsRepository = new InMemoryEducationRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitysRepository()
    sut = new FetchEducationRecordsUseCase(educationRecordsRepository)

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

  it('should be able fetch education records', async () => {
    for (let i = 1; i <= 22; i++) {
      await educationRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: '2024-01',
        schools: parseInt(`${i}`),
        students: parseInt(`${i}`),
        teachers: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    for (let i = 1; i <= 5; i++) {
      await educationRecordsRepository.register({
        city_id: 'city-01',
        user_id: 'user-01',
        month: '2023-02',
        schools: parseInt(`${i}`),
        students: parseInt(`${i}`),
        teachers: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    const { educationRecords } = await sut.execute({
      page: 2,
      cityId: 'city-01',
      items: 20,
      date: new Date('2024-01'),
    })

    expect(educationRecords).toHaveLength(2)
  })
})
