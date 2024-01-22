import { InMemoryHealthRecordsRepository } from '@/repositories/in-memory/in-memory-health-records-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { EditHealthRecordUseCase } from './edit'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-cities-repository'

let healthRecordsRepository: InMemoryHealthRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitysRepository
let sut: EditHealthRecordUseCase

describe('Edit Health Record Use Case', () => {
  beforeEach(async () => {
    healthRecordsRepository = new InMemoryHealthRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitysRepository()
    sut = new EditHealthRecordUseCase(healthRecordsRepository)

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
      month: new Date('01/01/2024'),
      doctors: 100,
      services: 1000,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-01-13T00:00:00.000Z',
    })

    await healthRecordsRepository.register({
      id: 'health-02',
      city_id: 'city-01',
      month: new Date('01/02/2024'),
      doctors: 200,
      services: 1000,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-02-13T00:00:00.000Z',
    })
  })

  it('should be able edit health record', async () => {
    const { healthRecordEdited } = await sut.execute({
      id: 'health-01',
      data: {
        doctors: 150,
        updated_at: new Date('2024-01-14'),
      },
    })

    expect(healthRecordEdited).not.toEqual(null)
    expect.objectContaining({ healthRecordEdited })
  })

  it('not should be able edit city with date exactly month', async () => {
    await expect(() =>
      sut.execute({
        id: 'health-02',
        data: {
          month: new Date('01/01/2024'),
        },
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
