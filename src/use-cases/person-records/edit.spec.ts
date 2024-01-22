import { expect, it, describe, beforeEach } from 'vitest'
import { EditPersonRecordUseCase } from './edit'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InMemoryPersonRecordsRepository } from '@/repositories/in-memory/in-memory-person-records'

let personRecordsRepository: InMemoryPersonRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: EditPersonRecordUseCase

describe('Edit Person Record Use Case', () => {
  beforeEach(async () => {
    personRecordsRepository = new InMemoryPersonRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new EditPersonRecordUseCase(personRecordsRepository)

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

  it('should be able edit person record', async () => {
    const { personRecordEdited } = await sut.execute({
      id: 'person-01',
      data: {
        staffs: 150,
        updated_at: new Date('2024-01-14'),
      },
    })

    expect(personRecordEdited).not.toEqual(null)
    expect.objectContaining({ personRecordEdited })
  })

  it('not should be able edit city with date exactly month', async () => {
    await expect(() =>
      sut.execute({
        id: 'person-02',
        data: {
          month: new Date('01/01/2024'),
        },
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
