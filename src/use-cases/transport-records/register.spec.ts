import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterTransportRecordsUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { InvalidUserOrChamberError } from '../errors/records/invalid-user-or-chamber'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InMemoryTransportRecordsRepository } from '@/repositories/in-memory/in-memory-transport-records-repository'

let transportRecordsRepository: InMemoryTransportRecordsRepository
let usersRepository: InMemoryUsersRepository
let chambersRepository: InMemoryChambersRepository
let sut: RegisterTransportRecordsUseCase

describe('Register Transport Records Use Case', () => {
  beforeEach(async () => {
    transportRecordsRepository = new InMemoryTransportRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    chambersRepository = new InMemoryChambersRepository()

    sut = new RegisterTransportRecordsUseCase(
      transportRecordsRepository,
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

    const { transport_record } = await sut.execute({
      month: new Date('2024-02'),
      cars: 10,
      bus: 24789,
      machines: 256,
      total: 563.0 * 100,
      chamberId: user.chamber_id,
      userId: user.id,
    })

    expect(transport_record.id).toEqual(expect.any(String))
  })

  it('not should be able register education record', async () => {
    await expect(() =>
      sut.execute({
        month: new Date('01/01/2024'),
        cars: 10,
        bus: 24789,
        machines: 256,
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
      cars: 10,
      bus: 24789,
      machines: 256,
      total: 563.0 * 100,
      chamberId: user.chamber_id,
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        month: new Date('01/01/2024'),
        cars: 10,
        bus: 24789,
        machines: 256,
        total: 563.0 * 100,
        chamberId: user.chamber_id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
