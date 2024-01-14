import { InMemoryEducationRecordsRepository } from '@/repositories/in-memory/in-memory-education-records-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { DeleteEducationRecordUseCase } from './delete'
import { RecordsNotExistsError } from '../errors/records/records-not-exists'

let educationRecordsRepository: InMemoryEducationRecordsRepository
let usersRepository: InMemoryUsersRepository
let chambersRepository: InMemoryChambersRepository
let sut: DeleteEducationRecordUseCase

describe('Delete Education Record Use Case', () => {
  beforeEach(async () => {
    educationRecordsRepository = new InMemoryEducationRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    chambersRepository = new InMemoryChambersRepository()
    sut = new DeleteEducationRecordUseCase(educationRecordsRepository)

    await chambersRepository.create({
      id: 'chamber-01',
      name: 'Sacramento',
      state: 'MG',
    })

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678910',
      password: '12345678910',
      chamber_id: 'chamber-01',
    })

    await educationRecordsRepository.register({
      id: 'education-01',
      chamber_id: 'chamber-01',
      month: new Date('01/01/2024'),
      schools: 100,
      students: 1000,
      teachers: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-01-13T00:00:00.000Z',
    })

    await educationRecordsRepository.register({
      id: 'education-02',
      chamber_id: 'chamber-01',
      month: new Date('01/02/2024'),
      schools: 200,
      students: 1000,
      teachers: 500,
      total: 50000000,
      user_id: 'user-01',
      created_at: '2024-02-13T00:00:00.000Z',
    })
  })

  it('should be able delete education record', async () => {
    await sut.execute({
      id: 'education-01',
    })

    const educationRecords = await educationRecordsRepository.fetch(
      1,
      'chamber-01',
    )

    expect(educationRecords).toHaveLength(1)
  })

  it('not should be able delete education record with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(RecordsNotExistsError)
  })
})
