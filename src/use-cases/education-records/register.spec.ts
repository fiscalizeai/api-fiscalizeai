import { InMemoryEducationRecordsRepository } from '@/repositories/in-memory/in-memory-education-records-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterEducationRecordsUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'

let educationRecordsRepository: InMemoryEducationRecordsRepository
let usersRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: RegisterEducationRecordsUseCase

describe('Register Education Records Use Case', () => {
  beforeEach(async () => {
    educationRecordsRepository = new InMemoryEducationRecordsRepository()
    usersRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()

    sut = new RegisterEducationRecordsUseCase(
      educationRecordsRepository,
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

    const { education_record } = await sut.execute({
      month: new Date('2024-02'),
      schools: 10,
      students: 24789,
      teachers: 256,
      total: 563.0 * 100,
      cityId: user.city_id,
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
      schools: 10,
      students: 24789,
      teachers: 256,
      total: 563.0 * 100,
      cityId: user.city_id,
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        month: new Date('01/01/2024'),
        schools: 10,
        students: 24789,
        teachers: 256,
        total: 563.0 * 100,
        cityId: user.city_id,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(RecordsAlreadyExistsError)
  })
})
