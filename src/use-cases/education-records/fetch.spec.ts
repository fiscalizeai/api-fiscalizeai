import { expect, it, describe, beforeEach } from 'vitest'
import { FetchEducationRecordsUseCase } from './fetch'
import { InMemoryEducationRecordsRepository } from '@/repositories/in-memory/in-memory-education-records-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'

let usersRepository: InMemoryUsersRepository
let chambersRepository: InMemoryChambersRepository
let educationRecordsRepository: InMemoryEducationRecordsRepository
let sut: FetchEducationRecordsUseCase

describe('Fetch Education Records Use Case', () => {
  beforeEach(async () => {
    educationRecordsRepository = new InMemoryEducationRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    chambersRepository = new InMemoryChambersRepository()
    sut = new FetchEducationRecordsUseCase(educationRecordsRepository)

    await chambersRepository.create({
      id: 'chamber-01',
      name: 'Sacramento',
      state: 'MG',
    })

    await usersRepository.create({
      id: 'user-01',
      email: 'johndoe@example.com',
      name: 'John Doe',
      cpf: 'cpf-user',
      password: 'cpf-user',
      chamber_id: 'chamber-01',
    })
  })

  it('should be able fetch education records', async () => {
    for (let i = 1; i <= 22; i++) {
      await educationRecordsRepository.register({
        chamber_id: 'chamber-01',
        user_id: 'user-01',
        month: '2024-01',
        schools: parseInt(`${i}`),
        students: parseInt(`${i}`),
        teachers: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    for (let i = 1; i <= 5; i++) {
      await educationRecordsRepository.register({
        chamber_id: 'chamber-01',
        user_id: 'user-01',
        month: '2023-02',
        schools: parseInt(`${i}`),
        students: parseInt(`${i}`),
        teachers: parseInt(`${i}`),
        total: parseInt(`${i}`),
        created_at: new Date(),
      })
    }

    const { educationRecords } = await sut.execute({
      page: 2,
      chamberId: 'chamber-01',
      items: 20,
      date: new Date('2024-01'),
    })

    expect(educationRecords).toHaveLength(2)
  })
})
