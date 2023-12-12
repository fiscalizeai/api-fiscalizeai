import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { FetchUsersByNameUseCase } from './fetch-users-by-name'

let userRepository: InMemoryUsersRepository
let sut: FetchUsersByNameUseCase

describe('Fetch Users By Name Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    sut = new FetchUsersByNameUseCase(userRepository)
  })

  it('should be able fetch users by name', async () => {
    for (let i = 1; i <= 22; i++) {
      await userRepository.create({
        name: `Vereador Uberaba ${i}`,
        cpf: `123456789${i}`,
        password: 'password',
        email: `vereador${i}@example.com`,
        chamber_id: 'chamber-01',
      })
    }

    const { users } = await sut.execute({
      name: 'Uber',
      page: 2,
    })

    expect(users).toHaveLength(2)
  })
})
