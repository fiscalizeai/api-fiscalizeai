import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterPersonRecordsUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { InvalidUserOrChamberError } from '../errors/records/invalid-user-or-chamber'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InMemoryPersonRecordsRepository } from '@/repositories/in-memory/in-memory-person-records'

let personRecordsRepository: InMemoryPersonRecordsRepository
let usersRepository: InMemoryUsersRepository
let chambersRepository: InMemoryChambersRepository
let sut: RegisterPersonRecordsUseCase

describe('Register Person Records Use Case', () => {
  beforeEach(async () => {
    personRecordsRepository = new InMemoryPersonRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    chambersRepository = new InMemoryChambersRepository()

    sut = new RegisterPersonRecordsUseCase(
      personRecordsRepository,
      usersRepository,
      chambersRepository,
    )
  })

  it('should be able register person record', async () => {
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

    const { personRecord } = await sut.execute({
      month: new Date('2024-02'),
      contractors: 10,
      headcounts: 24789,
      staffs: 256,
      total: 563.0 * 100,
      chamberId: user.chamber_id,
      userId: user.id,
    })

    expect(personRecord.id).toEqual(expect.any(String))
  })

  it('not should be able register person record', async () => {
    await expect(() =>
      sut.execute({
        month: new Date('01/01/2024'),
        contractors: 10,
        headcounts: 24789,
        staffs: 256,
        total: 563.0 * 100,
        chamberId: 'wrong-id',
        userId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(InvalidUserOrChamberError)
  })

  it('not should be able register person record with same month in', async () => {
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
      contractors: 10,
      headcounts: 24789,
      staffs: 256,
      total: 563.0 * 100,
      chamberId: user.chamber_id,
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        month: new Date('01/01/2024'),
        contractors: 10,
        headcounts: 24789,
        staffs: 256,
        total: 563.0 * 100,
        chamberId: user.chamber_id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
