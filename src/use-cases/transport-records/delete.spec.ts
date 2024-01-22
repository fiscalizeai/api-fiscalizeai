import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { InMemoryTransportRecordsRepository } from '@/repositories/in-memory/in-memory-transport-records-repository'
import { DeleteTransportRecordUseCase } from './delete'

let transportRecordsRepository: InMemoryTransportRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitysRepository
let sut: DeleteTransportRecordUseCase

describe('Delete Transport Record Use Case', () => {
  beforeEach(async () => {
    transportRecordsRepository = new InMemoryTransportRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitysRepository()
    sut = new DeleteTransportRecordUseCase(transportRecordsRepository)

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
      month: new Date('01/01/2024'),
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
      month: new Date('01/02/2024'),
      cars: 200,
      bus: 1000,
      machines: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-02-13T00:00:00.000Z',
    })
  })

  it('should be able delete transport record', async () => {
    await sut.execute({
      id: 'transport-01',
    })

    const educationRecords = await transportRecordsRepository.fetch(
      1,
      'city-01',
    )

    expect(educationRecords).toHaveLength(1)
  })

  it('not should be able delete transport record with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
