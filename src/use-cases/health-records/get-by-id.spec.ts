import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryHealthRecordsRepository } from '@/repositories/in-memory/in-memory-health-records-repository'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { GetHealthRecordByIdUseCase } from './get-by-id'

let healthRecordsRepository: InMemoryHealthRecordsRepository
let sut: GetHealthRecordByIdUseCase

describe('Get Health Record By Id Use Case', () => {
  beforeEach(async () => {
    healthRecordsRepository = new InMemoryHealthRecordsRepository()
    sut = new GetHealthRecordByIdUseCase(healthRecordsRepository)

    await healthRecordsRepository.register({
      id: 'health-01',
      city_id: 'city-01',
      user_id: 'user-01',
      month: 1,
      year: 2024,
      services: 1,
      doctors: 1,
      total: 1,
    })
  })

  it('should be able get health record by id', async () => {
    const { healthRecord } = await sut.execute({
      id: 'health-01',
    })

    expect(healthRecord?.id).toEqual(expect.any(String))
  })

  it('not should be able get city with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
