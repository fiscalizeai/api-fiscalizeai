import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { GetChamberByIdUseCase } from './get-by-id'
import { ChamberNotFoundError } from '../errors/chambers/chamber-not-found'

let chamberRepository: InMemoryChambersRepository
let sut: GetChamberByIdUseCase

describe('Get Chamber By Id Use Case', () => {
  beforeEach(async () => {
    chamberRepository = new InMemoryChambersRepository()
    sut = new GetChamberByIdUseCase(chamberRepository)

    await chamberRepository.create({
      id: 'chamber-01',
      name: 'Sacramento',
      state: 'MG',
    })
  })

  it('should be able get chamber by id', async () => {
    const { chamber } = await sut.execute({
      id: 'chamber-01',
    })

    expect(chamber?.name).toEqual('Sacramento')
  })

  it('not should be able get chamber with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(ChamberNotFoundError)
  })
})
