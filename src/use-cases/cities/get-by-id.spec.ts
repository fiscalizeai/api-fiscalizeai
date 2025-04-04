import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { GetCityByIdUseCase } from './get-by-id'
import { CityNotFoundError } from '../errors/cities/city-not-found'

let cityRepository: InMemoryCitiesRepository
let sut: GetCityByIdUseCase

describe('Get City By Id Use Case', () => {
  beforeEach(async () => {
    cityRepository = new InMemoryCitiesRepository()
    sut = new GetCityByIdUseCase(cityRepository)

    await cityRepository.create({
      id: 'city-01',
      name: 'Sacramento',
      state: 'MG',
    })
  })

  it('should be able get city by id', async () => {
    const { city } = await sut.execute({
      id: 'city-01',
    })

    expect(city?.name).toEqual('Sacramento')
  })

  it('not should be able get city with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(CityNotFoundError)
  })
})
