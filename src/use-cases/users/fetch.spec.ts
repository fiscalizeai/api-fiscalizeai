import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { FetchUserUseCase } from './fetch'

let usersRepository: InMemoryUsersRepository
let sut: FetchUserUseCase

describe('Fetch Users Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserUseCase(usersRepository)
  })

  it('should be able fetch users', async () => {
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
      page: 2,
    })

    expect(users).toHaveLength(2)
  })
})
