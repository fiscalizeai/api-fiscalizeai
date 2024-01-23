import { InMemoryHealthRecordsRepository } from '@/repositories/in-memory/in-memory-health-records-repository' // Troquei de "education" para "health"
import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterHealthRecordsUseCase } from './register' // Troquei de "education" para "health"
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'

let healthRecordsRepository: InMemoryHealthRecordsRepository // Troquei de "education" para "health"
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: RegisterHealthRecordsUseCase // Troquei de "education" para "health"

describe('Register Health Records Use Case', () => {
  // Troquei de "education" para "health"
  beforeEach(async () => {
    healthRecordsRepository = new InMemoryHealthRecordsRepository() // Troquei de "education" para "health"
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()

    sut = new RegisterHealthRecordsUseCase( // Troquei de "education" para "health"
      healthRecordsRepository, // Troquei de "education" para "health"
      usersRepository,
      citiesRepository,
    )
  })

  it('should be able register health record', async () => {
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

    const { health_record } = await sut.execute({
      month: 1,
      year: 2024,
      doctors: 10,
      services: 24789,
      total: 563.0 * 100,
      cityId: user.city_id,
      userId: user.id,
    })

    expect(health_record.id).toEqual(expect.any(String))
  })

  it('not should be able register health record', async () => {
    await expect(() =>
      sut.execute({
        month: 1,
        year: 2024,
        doctors: 10,
        services: 24789,
        total: 563.0 * 100,
        cityId: 'wrong-id',
        userId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(InvalidUserOrCityError)
  })

  it('not should be able register health record with same month in', async () => {
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
      doctors: 10,
      services: 24789,
      total: 563.0 * 100,
      cityId: user.city_id,
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        month: 1,
        year: 2024,
        doctors: 10,
        services: 24789,
        total: 563.0 * 100,
        cityId: user.city_id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
