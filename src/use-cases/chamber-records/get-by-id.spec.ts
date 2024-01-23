import { expect, it, describe, beforeEach } from 'vitest'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'
import { GetChamberRecordByIdUseCase } from './get-by-id'
import { InMemoryChamberRecordsRepository } from '@/repositories/in-memory/in-memory-chamber-records'

let chamberRecordsRepository: InMemoryChamberRecordsRepository
let sut: GetChamberRecordByIdUseCase

describe('Get Chamber Record By Id Use Case', () => {
  beforeEach(async () => {
    chamberRecordsRepository = new InMemoryChamberRecordsRepository()
    sut = new GetChamberRecordByIdUseCase(chamberRecordsRepository)

    await chamberRecordsRepository.register({
      id: 'chamber-01',
      city_id: 'city-01',
      user_id: 'user-01',
      month: 1,
      year: 2024,
      contractors: 1,
      headcounts: 1,
      staffs: 1,
      total: 1,
    })
  })

  it('should be able get chamber record by id', async () => {
    const { chamberRecord } = await sut.execute({
      id: 'chamber-01',
    })

    expect(chamberRecord?.id).toEqual(expect.any(String))
  })

  it('not should be able get chamber with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
