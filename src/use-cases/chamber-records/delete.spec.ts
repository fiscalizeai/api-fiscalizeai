import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { DeleteChamberRecordUseCase } from './delete'
import { InMemoryChamberRecordsRepository } from '@/repositories/in-memory/in-memory-chamber-records'

let chamberRecordsRepository: InMemoryChamberRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: DeleteChamberRecordUseCase

describe('Delete Chamber Record Use Case', () => {
  beforeEach(async () => {
    chamberRecordsRepository = new InMemoryChamberRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new DeleteChamberRecordUseCase(chamberRecordsRepository)

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

  it('should be able delete chamber record', async () => {
    await sut.execute({
      id: 'chamber-01',
    })

    const chamberRecords = await chamberRecordsRepository.fetch(1, 'city-01')

    expect(chamberRecords?.chamber).toHaveLength(1)
  })

  it('not should be able delete chamber record with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
