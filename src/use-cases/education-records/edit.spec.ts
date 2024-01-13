import { InMemoryEducationRecordsRepository } from '@/repositories/in-memory/in-memory-education-records-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { EditEducationRecordUseCase } from './edit'
import { EducationRecordsAlreadyExistsError } from '../errors/education/education-record-already-exists'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'

let educationRecordsRepository: InMemoryEducationRecordsRepository
let usersRepository: InMemoryUsersRepository
let chambersRepository: InMemoryChambersRepository
let sut: EditEducationRecordUseCase

describe('Edit Chamber Users Use Case', () => {
  beforeEach(async () => {
    educationRecordsRepository = new InMemoryEducationRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    chambersRepository = new InMemoryChambersRepository()
    sut = new EditEducationRecordUseCase(educationRecordsRepository)

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

  it('should be able edit education record', async () => {
    const { educationRecordEdited } = await sut.execute({
      id: 'education-01',
      data: {
        schools: 150,
        updated_at: new Date('2024-01-14'),
      },
    })

    expect(educationRecordEdited).not.toEqual(null)
    expect.objectContaining({ educationRecordEdited })
  })

  it('not should be able edit chamber with date exactly month', async () => {
    await expect(() =>
      sut.execute({
        id: 'education-02',
        data: {
          month: new Date('01/01/2024'),
        },
      }),
    ).rejects.toBeInstanceOf(EducationRecordsAlreadyExistsError)
  })
})
