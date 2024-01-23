import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryEducationRecordsRepository } from '@/repositories/in-memory/in-memory-education-records-repository'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { GetEducationRecordByIdUseCase } from './get-by-id'

let educationRecordsRepository: InMemoryEducationRecordsRepository
let sut: GetEducationRecordByIdUseCase

describe('Get Education Record By Id Use Case', () => {
  beforeEach(async () => {
    educationRecordsRepository = new InMemoryEducationRecordsRepository()
    sut = new GetEducationRecordByIdUseCase(educationRecordsRepository)

    await educationRecordsRepository.register({
      id: 'education-01',
      city_id: 'city-01',
      user_id: 'user-01',
      month: 1,
      year: 2024,
      schools: 1,
      students: 1,
      teachers: 1,
      total: 1,
    })
  })

  it('should be able get education record by id', async () => {
    const { educationRecord } = await sut.execute({
      id: 'education-01',
    })

    expect(educationRecord?.id).toEqual(expect.any(String))
  })

  it('not should be able get city with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
