import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { InMemoryHealthRecordsRepository } from '@/repositories/in-memory/in-memory-health-records-repository'
import { DeleteHealthRecordUseCase } from './delete'

let healthRecordsRepository: InMemoryHealthRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: DeleteHealthRecordUseCase

describe('Delete Health Record Use Case', () => {
  beforeEach(async () => {
    healthRecordsRepository = new InMemoryHealthRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new DeleteHealthRecordUseCase(healthRecordsRepository)

    await citiesRepository.create({
      id: 'city-01',
      name: 'Sacramento',
      state: 'MG',
    })

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678910',
      password: '12345678910',
      city_id: 'city-01',
    })

    await healthRecordsRepository.register({
      id: 'health-01',
      city_id: 'city-01',
      month: 1,
      year: 2024,
      doctors: 100,
      services: 1000,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-01-13T00:00:00.000Z',
    })

    await healthRecordsRepository.register({
      id: 'health-02',
      city_id: 'city-01',
      month: 2,
      year: 2024,
      doctors: 200,
      services: 1000,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-02-13T00:00:00.000Z',
    })
  })

  it('should be able delete health record', async () => {
    await sut.execute({
      id: 'health-01',
    })

    const healthRecords = await healthRecordsRepository.fetch(1, 'city-01')

    expect(healthRecords?.health).toHaveLength(1)
  })

  it('not should be able delete health record with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
