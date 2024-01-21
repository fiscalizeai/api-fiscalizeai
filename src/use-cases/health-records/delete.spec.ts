import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-citys-repository'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { InMemoryHealthRecordsRepository } from '@/repositories/in-memory/in-memory-health-records-repository'
import { DeleteHealthRecordUseCase } from './delete'

let healthRecordsRepository: InMemoryHealthRecordsRepository
let usersRepository: InMemoryUsersRepository
let citysRepository: InMemoryCitysRepository
let sut: DeleteHealthRecordUseCase

describe('Delete Health Record Use Case', () => {
  beforeEach(async () => {
    healthRecordsRepository = new InMemoryHealthRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citysRepository = new InMemoryCitysRepository()
    sut = new DeleteHealthRecordUseCase(healthRecordsRepository)

    await citysRepository.create({
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

  it('should be able delete health record', async () => {
    await sut.execute({
      id: 'health-01',
    })

    const transportRecords = await healthRecordsRepository.fetch(
      1,
      'city-01',
    )

    expect(transportRecords).toHaveLength(1)
  })

  it('not should be able delete health record with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
