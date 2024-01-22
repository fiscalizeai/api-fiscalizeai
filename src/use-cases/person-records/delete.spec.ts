import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { DeletePersonRecordUseCase } from './delete'
import { InMemoryPersonRecordsRepository } from '@/repositories/in-memory/in-memory-person-records'

let personRecordsRepository: InMemoryPersonRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitysRepository
let sut: DeletePersonRecordUseCase

describe('Delete Person Record Use Case', () => {
  beforeEach(async () => {
    personRecordsRepository = new InMemoryPersonRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitysRepository()
    sut = new DeletePersonRecordUseCase(personRecordsRepository)

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

    await personRecordsRepository.register({
      id: 'person-01',
      city_id: 'city-01',
      month: new Date('01/01/2024'),
      contractors: 100,
      headcounts: 1000,
      staffs: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-01-13T00:00:00.000Z',
    })

    await personRecordsRepository.register({
      id: 'person-02',
      city_id: 'city-01',
      month: new Date('01/02/2024'),
      contractors: 200,
      headcounts: 1000,
      staffs: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-02-13T00:00:00.000Z',
    })
  })

  it('should be able delete person record', async () => {
    await sut.execute({
      id: 'person-01',
    })

    const personRecords = await personRecordsRepository.fetch(1, 'city-01')

    expect(personRecords).toHaveLength(1)
  })

  it('not should be able delete person record with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
