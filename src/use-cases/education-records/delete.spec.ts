import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { InMemoryEducationRecordsRepository } from '@/repositories/in-memory/in-memory-education-records-repository'
import { DeleteEducationRecordUseCase } from './delete'

let educationRecordsRepository: InMemoryEducationRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: DeleteEducationRecordUseCase

describe('Delete Education Record Use Case', () => {
  beforeEach(async () => {
    educationRecordsRepository = new InMemoryEducationRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new DeleteEducationRecordUseCase(educationRecordsRepository)

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

    await educationRecordsRepository.register({
      id: 'education-01',
      city_id: 'city-01',
      month: 1,
      year: 2024,
      schools: 100,
      students: 1000,
      teachers: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-01-13T00:00:00.000Z',
    })

    await educationRecordsRepository.register({
      id: 'education-02',
      city_id: 'city-01',
      month: 2,
      year: 2024,
      schools: 200,
      students: 1000,
      teachers: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-02-13T00:00:00.000Z',
    })
  })

  it('should be able delete education record', async () => {
    await sut.execute({
      id: 'education-01',
    })

    const transportRecords = await educationRecordsRepository.fetch(
      1,
      'city-01',
    )

    expect(transportRecords?.education).toHaveLength(1)
  })

  it('not should be able delete education record with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
