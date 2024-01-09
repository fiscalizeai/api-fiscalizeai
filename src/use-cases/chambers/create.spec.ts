import { expect, it, describe, beforeEach } from 'vitest'
import { CreateChamberUseCase } from './create'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { ChamberAlreadyExistsError } from '../errors/chamber-already-exists'

let chamberRepository: InMemoryChambersRepository
let sut: CreateChamberUseCase

describe('Register Users Use Case', () => {
  beforeEach(async () => {
    chamberRepository = new InMemoryChambersRepository()
    sut = new CreateChamberUseCase(chamberRepository)
  })

  it('should be able create chamber', async () => {
    const { chamber } = await sut.execute({
      name: 'Sacramento',
      state: 'MG',
    })

    expect(chamber.id).toEqual(expect.any(String))
  })

  it('not should be able create chamber with same name in state', async () => {
    await sut.execute({
      name: 'Sacramento',
      state: 'MG',
    })

    await expect(() =>
      sut.execute({
        name: 'Sacramento',
        state: 'MG',
      }),
    ).rejects.toBeInstanceOf(ChamberAlreadyExistsError)
  })
})
