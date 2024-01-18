import { expect, it, describe, beforeEach } from 'vitest'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { GetPersonRecordByIdUseCase } from './get-by-id'
import { InMemoryPersonRecordsRepository } from '@/repositories/in-memory/in-memory-person-records'

let personRecordsRepository: InMemoryPersonRecordsRepository
let sut: GetPersonRecordByIdUseCase

describe('Get Person Record By Id Use Case', () => {
  beforeEach(async () => {
    personRecordsRepository = new InMemoryPersonRecordsRepository()
    sut = new GetPersonRecordByIdUseCase(personRecordsRepository)

    await personRecordsRepository.register({
      id: 'person-01',
      chamber_id: 'chamber-01',
      user_id: 'user-01',
      month: '2024/01',
      contractors: 1,
      headcounts: 1,
      staffs: 1,
      total: 1,
    })
  })

  it('should be able get person record by id', async () => {
    const { personRecord } = await sut.execute({
      id: 'person-01',
    })

    expect(personRecord?.id).toEqual(expect.any(String))
  })

  it('not should be able get person with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
