import { expect, it, describe, beforeEach } from 'vitest'
import { EditChamberRecordUseCase } from './edit'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InMemoryChamberRecordsRepository } from '@/repositories/in-memory/in-memory-chamber-records'

let chamberRecordsRepository: InMemoryChamberRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: EditChamberRecordUseCase

describe('Edit Chamber Record Use Case', () => {
  beforeEach(async () => {
    chamberRecordsRepository = new InMemoryChamberRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new EditChamberRecordUseCase(chamberRecordsRepository)

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

    await chamberRecordsRepository.register({
      id: 'chamber-01',
      city_id: 'city-01',
      month: 1,
      year: 2024,
      contractors: 100,
      headcounts: 1000,
      staffs: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-01-13T00:00:00.000Z',
    })

    await chamberRecordsRepository.register({
      id: 'chamber-02',
      city_id: 'city-01',
      month: 2,
      year: 2024,
      contractors: 200,
      headcounts: 1000,
      staffs: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-02-13T00:00:00.000Z',
    })
  })

  it('should be able edit chamber record', async () => {
    const { chamberRecordEdited } = await sut.execute({
      id: 'chamber-01',
      data: {
        staffs: 150,
        updated_at: new Date('2024-01-14'),
      },
    })

    expect(chamberRecordEdited).not.toEqual(null)
    expect.objectContaining({ chamberRecordEdited })
  })

  it('not should be able edit city with date exactly month', async () => {
    await expect(() =>
      sut.execute({
        id: 'chamber-02',
        data: {
          month: 1,
          year: 2024,
        },
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
