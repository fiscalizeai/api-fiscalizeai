import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { EditChamberUseCase } from './edit'
import { ChamberNotFoundError } from '../errors/chambers/chamber-not-found'

let chamberRepository: InMemoryChambersRepository
let sut: EditChamberUseCase

describe('Edit Chamber Users Use Case', () => {
  beforeEach(async () => {
    chamberRepository = new InMemoryChambersRepository()
    sut = new EditChamberUseCase(chamberRepository)

    await chamberRepository.create({
      id: 'chamber-01',
      name: 'Sacrameto',
      state: 'MT',
    })
  })

  it('should be able edit chamber', async () => {
    const { chamberEdited } = await sut.execute({
      id: 'chamber-01',
      data: {
        name: 'Sacramento',
        state: 'MG',
      },
    })

    expect(chamberEdited).not.toEqual(null)
    expect.objectContaining({ chamberEdited })
  })

  it('not should be able edit chamber not exist', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong-id-chamber',
        data: {
          name: 'Sacramento',
          state: 'MG',
        },
      }),
    ).rejects.toBeInstanceOf(ChamberNotFoundError)
  })
})
