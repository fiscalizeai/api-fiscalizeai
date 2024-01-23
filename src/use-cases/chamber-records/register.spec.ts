import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterChamberRecordsUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InMemoryChamberRecordsRepository } from '@/repositories/in-memory/in-memory-chamber-records'

let chamberRecordsRepository: InMemoryChamberRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: RegisterChamberRecordsUseCase

describe('Register Chamber Records Use Case', () => {
  beforeEach(async () => {
    chamberRecordsRepository = new InMemoryChamberRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()

    sut = new RegisterChamberRecordsUseCase(
      chamberRecordsRepository,
      usersRepository,
      citiesRepository,
    )
  })

  it('should be able register chamber record', async () => {
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

    const { chamberRecord } = await sut.execute({
      month: 1,
      year: 2024,
      contractors: 10,
      headcounts: 24789,
      staffs: 256,
      total: 563.0 * 100,
      cityId: user.city_id,
      userId: user.id,
    })

    expect(chamberRecord.id).toEqual(expect.any(String))
  })

  it('not should be able register chamber record', async () => {
    await expect(() =>
      sut.execute({
        month: 1,
        year: 2024,
        contractors: 10,
        headcounts: 24789,
        staffs: 256,
        total: 563.0 * 100,
        cityId: 'wrong-id',
        userId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(InvalidUserOrCityError)
  })

  it('not should be able register chamber record with same month in', async () => {
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
      month: 1,
      year: 2024,
      contractors: 10,
      headcounts: 24789,
      staffs: 256,
      total: 563.0 * 100,
      cityId: user.city_id,
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        month: 1,
        year: 2024,
        contractors: 10,
        headcounts: 24789,
        staffs: 256,
        total: 563.0 * 100,
        cityId: user.city_id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
