import { InMemoryEducationRecordsRepository } from '@/repositories/in-memory/in-memory-education-records-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterEducationRecordsUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { InvalidUserOrChamberError } from '../errors/education/invalid-user-or-chamber'
import { EducationRecordsAlreadyExistsError } from '../errors/education/education-record-already-exists'

let educationRecordsRepository: InMemoryEducationRecordsRepository
let usersRepository: InMemoryUsersRepository
let chambersRepository: InMemoryChambersRepository
let sut: RegisterEducationRecordsUseCase

describe('Register Education Records Use Case', () => {
  beforeEach(async () => {
    educationRecordsRepository = new InMemoryEducationRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    chambersRepository = new InMemoryChambersRepository()

    sut = new RegisterEducationRecordsUseCase(
      educationRecordsRepository,
      usersRepository,
      chambersRepository,
    )
  })

  it('should be able register education record', async () => {
    const chamber = await chambersRepository.create({
      id: 'chamber-01',
      name: 'Sacramento',
      state: 'MG',
    })

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678910',
      password: '12345678910',
      chamber_id: chamber.id,
    })

    const { education_record } = await sut.execute({
      month: new Date('2024-02'),
      schools: 10,
      students: 24789,
      teachers: 256,
      total: 563.0 * 100,
      chamberId: user.chamber_id,
      userId: user.id,
    })

    expect(education_record.id).toEqual(expect.any(String))
  })

  it('not should be able register education record', async () => {
    await expect(() =>
      sut.execute({
        month: new Date('01/01/2024'),
        schools: 10,
        students: 24789,
        teachers: 256,
        total: 563.0 * 100,
        chamberId: 'wrong-id',
        userId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(InvalidUserOrChamberError)
  })

  it('not should be able register education record with same month in', async () => {
    const chamber = await chambersRepository.create({
      id: 'chamber-01',
      name: 'Sacramento',
      state: 'MG',
    })

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678910',
      password: '12345678910',
      chamber_id: chamber.id,
    })

    await sut.execute({
      month: new Date('01/01/2024'),
      schools: 10,
      students: 24789,
      teachers: 256,
      total: 563.0 * 100,
      chamberId: user.chamber_id,
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        month: new Date('01/01/2024'),
        schools: 10,
        students: 24789,
        teachers: 256,
        total: 563.0 * 100,
        chamberId: user.chamber_id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(EducationRecordsAlreadyExistsError)
  })
})
