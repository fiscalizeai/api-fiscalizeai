import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'
import { EditCityUseCase } from './edit'
import { CityNotFoundError } from '../errors/cities/city-not-found'

let cityRepository: InMemoryCitiesRepository
let sut: EditCityUseCase

describe('Edit City Users Use Case', () => {
  beforeEach(async () => {
    cityRepository = new InMemoryCitiesRepository()
    sut = new EditCityUseCase(cityRepository)

    await cityRepository.create({
      id: 'city-01',
      name: 'Sacrameto',
      state: 'MT',
    })
  })

  it('should be able edit city', async () => {
    const { cityEdited } = await sut.execute({
      id: 'city-01',
      data: {
        name: 'Sacramento',
        state: 'MG',
      },
    })

    expect(cityEdited).not.toEqual(null)
    expect.objectContaining({ cityEdited })
  })

  it('not should be able edit city not exist', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id-city',
        data: {
          name: 'Sacramento',
          state: 'MG',
        },
      }),
    ).rejects.toBeInstanceOf(CityNotFoundError)
  })
})
