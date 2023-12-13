import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { GetChamberUseCase } from './get-city'
import { ResouceNotFoundError } from '../errors/resource-not-found'

let chamberRepository: InMemoryChambersRepository
let sut: GetChamberUseCase

describe('Get Chamber By Name Use Case', () => {
  beforeEach(async () => {
    chamberRepository = new InMemoryChambersRepository()
    sut = new GetChamberUseCase(chamberRepository)

    await chamberRepository.create({
      name: 'Sacramento',
      state: 'MG',
    })

    await chamberRepository.create({
      name: 'Uberaba',
      state: 'MG',
    })
  })

  it('should be able get chamber by name', async () => {
    const { chamber } = await sut.execute({
      name: 'Sacramento',
      state: 'MG',
    })

    expect(chamber?.name).toEqual('Sacramento')
  })

  it('not should be able get chamber with wrong name or state', async () => {
    await expect(() =>
      sut.execute({
        name: 'wrong name',
        state: 'wrong state',
      }),
    ).rejects.toBeInstanceOf(ResouceNotFoundError)
  })
})
