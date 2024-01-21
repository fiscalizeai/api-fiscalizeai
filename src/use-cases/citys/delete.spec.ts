import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCitysRepository } from '@/repositories/in-memory/in-memory-citys-repository'
import { DeleteCityUseCase } from './delete'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let citysRepository: InMemoryCitysRepository
let sut: DeleteCityUseCase

describe('Delete City Users Use Case', () => {
  beforeEach(async () => {
    citysRepository = new InMemoryCitysRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteCityUseCase(citysRepository, usersRepository)

    await citysRepository.create({
      id: 'city-01',
      name: 'Sacramento',
      state: 'MG',
    })

    await citysRepository.create({
      id: 'city-02',
      name: 'Uberaba',
      state: 'MG',
    })
  })

  it('should be able delete city', async () => {
    await sut.execute({
      id: 'city-02',
    })

    const citys = await citysRepository.fetch(1, 10)

    expect(citys).toHaveLength(1)
  })
})
