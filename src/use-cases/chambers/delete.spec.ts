import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { DeleteChamberUseCase } from './delete'

let chambersRepository: InMemoryChambersRepository
let sut: DeleteChamberUseCase

describe('Delete Chamber Users Use Case', () => {
  beforeEach(async () => {
    chambersRepository = new InMemoryChambersRepository()
    sut = new DeleteChamberUseCase(chambersRepository)

    await chambersRepository.create({
      id: 'chamber-01',
      name: 'Sacramento',
      state: 'MG',
    })

    await chambersRepository.create({
      id: 'chamber-02',
      name: 'Uberaba',
      state: 'MG',
    })
  })

  it('should be able delete chamber', async () => {
    await sut.execute({
      id: 'chamber-02',
    })

    const chambers = await chambersRepository.fetch(1, 10)

    console.log(chambers)

    expect(chambers).toHaveLength(1)
  })
})
