import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { EditChamberUseCase } from './edit'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { DeleteChamberUseCase } from './delete'
import { promise } from 'zod'

let chamberRepository: InMemoryChambersRepository
let sut: DeleteChamberUseCase

describe('Delete Chamber Users Use Case', () => {
  beforeEach(async () => {
    chamberRepository = new InMemoryChambersRepository()
    sut = new DeleteChamberUseCase(chamberRepository)

    await chamberRepository.create({
      id: 'chamber-01',
      name: 'Sacramento',
      state: 'MG',
    })

    await chamberRepository.create({
      id: 'chamber-02',
      name: 'Uberaba',
      state: 'MG',
    })
  })

  it('should be able delete chamber', async () => {
    await sut.execute({
      id: 'chamber-02',
    })

    const chambers = chamberRepository.findByState('MG', 1)

    expect(chambers)
  })
})
