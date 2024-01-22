import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterTransportRecordsUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InMemoryTransportRecordsRepository } from '@/repositories/in-memory/in-memory-transport-records-repository'

let transportRecordsRepository: InMemoryTransportRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitysRepository
let sut: RegisterTransportRecordsUseCase

describe('Register Transport Records Use Case', () => {
  beforeEach(async () => {
    transportRecordsRepository = new InMemoryTransportRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitysRepository()

    sut = new RegisterTransportRecordsUseCase(
      transportRecordsRepository,
      usersRepository,
      citiesRepository,
    )
  })

  it('should be able register education record', async () => {
    const city = await citiesRepository.create({
      id: 'city-01',
      name: 'Sacramento',
      state: 'MG',
    })

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678910',
      password: '12345678910',
      city_id: city.id,
    })

    const { transport_record } = await sut.execute({
      month: new Date('2024-02'),
      cars: 10,
      bus: 24789,
      machines: 256,
      total: 563.0 * 100,
      cityId: user.city_id,
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
        cityId: 'wrong-id',
        userId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(InvalidUserOrCityError)
  })

  it('not should be able register education record with same month in', async () => {
    const city = await citiesRepository.create({
      id: 'city-01',
      name: 'Sacramento',
      state: 'MG',
    })

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '12345678910',
      password: '12345678910',
      city_id: city.id,
    })

    await sut.execute({
      month: new Date('01/01/2024'),
      cars: 10,
      bus: 24789,
      machines: 256,
      total: 563.0 * 100,
      cityId: user.city_id,
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        month: new Date('01/01/2024'),
        cars: 10,
        bus: 24789,
        machines: 256,
        total: 563.0 * 100,
        cityId: user.city_id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
