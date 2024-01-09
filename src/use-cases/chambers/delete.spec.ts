import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { DeleteChamberUseCase } from './delete'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let chambersRepository: InMemoryChambersRepository
let sut: DeleteChamberUseCase

describe('Delete Chamber Users Use Case', () => {
  beforeEach(async () => {
    chambersRepository = new InMemoryChambersRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteChamberUseCase(chambersRepository, usersRepository)

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

    expect(chambers).toHaveLength(1)
  })
})
