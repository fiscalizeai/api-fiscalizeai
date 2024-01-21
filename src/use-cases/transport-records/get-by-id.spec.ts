import { expect, it, describe, beforeEach } from 'vitest'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { GetTransportRecordByIdUseCase } from './get-by-id'
import { InMemoryTransportRecordsRepository } from '@/repositories/in-memory/in-memory-transport-records-repository'

let transportRecordsRepository: InMemoryTransportRecordsRepository
let sut: GetTransportRecordByIdUseCase

describe('Get Transport Record By Id Use Case', () => {
  beforeEach(async () => {
    transportRecordsRepository = new InMemoryTransportRecordsRepository()
    sut = new GetTransportRecordByIdUseCase(transportRecordsRepository)

    await transportRecordsRepository.register({
      id: 'transport-01',
      city_id: 'city-01',
      user_id: 'user-01',
      month: '2024/01',
      cars: 1,
      bus: 1,
      machines: 1,
      total: 1,
    })
  })

  it('should be able get transport record by id', async () => {
    const { transportRecord } = await sut.execute({
      id: 'transport-01',
    })

    expect(transportRecord?.id).toEqual(expect.any(String))
  })

  it('not should be able get city with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
