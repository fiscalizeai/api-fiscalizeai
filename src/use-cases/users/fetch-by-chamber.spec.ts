import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryChambersRepository } from '@/repositories/in-memory/in-memory-chambers-repository'
import { FetchUserByChamberUseCase } from './fetch-by-chamber'

let usersRepository: InMemoryUsersRepository
let chambersRepository: InMemoryChambersRepository
let sut: FetchUserByChamberUseCase

describe('Fetch Users By Chamber Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    chambersRepository = new InMemoryChambersRepository()
    sut = new FetchUserByChamberUseCase(usersRepository, chambersRepository)

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

  it('should be able fetch users by chamber', async () => {
    for (let i = 1; i <= 22; i++) {
      await usersRepository.create({
        name: `Vereador Sacramento ${i}`,
        cpf: `123456789${i}`,
        password: 'password',
        email: `vereador${i}@example.com`,
        chamber_id: 'chamber-01',
      })
    }

    const { users } = await sut.execute({
      city: 'Sacramento',
      state: 'MG',
      page: 2,
    })

    expect(users).toHaveLength(2)
  })
})
