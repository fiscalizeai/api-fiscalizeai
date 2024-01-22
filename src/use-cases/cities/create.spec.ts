import { expect, it, describe, beforeEach } from 'vitest'
import { CreateCityUseCase } from './create'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { CityAlreadyExistsError } from '../errors/cities/city-already-exists'

let cityRepository: InMemoryCitiesRepository
let sut: CreateCityUseCase

describe('Register Users Use Case', () => {
  beforeEach(async () => {
    cityRepository = new InMemoryCitiesRepository()
    sut = new CreateCityUseCase(cityRepository)
  })

  it('should be able create city', async () => {
    const { city } = await sut.execute({
      name: 'Sacramento',
      state: 'MG',
    })

    expect(city.id).toEqual(expect.any(String))
  })

  it('not should be able create city with same name in state', async () => {
    await sut.execute({
      name: 'Sacramento',
      state: 'MG',
    })

    await expect(() =>
      sut.execute({
        name: 'Sacramento',
        state: 'MG',
      }),
    ).rejects.toBeInstanceOf(CityAlreadyExistsError)
  })
})
