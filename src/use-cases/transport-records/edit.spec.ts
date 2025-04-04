import { expect, it, describe, beforeEach } from 'vitest'
import { EditTransportRecordUseCase } from './edit'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InMemoryTransportRecordsRepository } from '@/repositories/in-memory/in-memory-transport-records-repository'

let transportRecordsRepository: InMemoryTransportRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: EditTransportRecordUseCase

describe('Edit Transport Record Use Case', () => {
  beforeEach(async () => {
    transportRecordsRepository = new InMemoryTransportRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new EditTransportRecordUseCase(transportRecordsRepository)

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

    await transportRecordsRepository.register({
      id: 'transport-01',
      city_id: 'city-01',
      month: 1,
      year: 2024,
      cars: 100,
      bus: 1000,
      machines: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-01-13T00:00:00.000Z',
    })

    await transportRecordsRepository.register({
      id: 'education-02',
      city_id: 'city-01',
      month: 2,
      year: 2024,
      cars: 200,
      bus: 1000,
      machines: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-02-13T00:00:00.000Z',
    })
  })

  it('should be able edit education record', async () => {
    const { transportRecordEdited } = await sut.execute({
      id: 'transport-01',
      data: {
        cars: 150,
        updated_at: new Date('2024-01-14'),
      },
    })

    expect(transportRecordEdited).not.toEqual(null)
    expect.objectContaining({ transportRecordEdited })
  })

  it('not should be able edit city with date exactly month', async () => {
    await expect(() =>
      sut.execute({
        id: 'education-02',
        data: {
          month: 1,
          year: 2024,
        },
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
