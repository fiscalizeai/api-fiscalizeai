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
        cpf: `cpf ${i}`,
        password: 'password',
        email: `vereador${i}@example.com`,
        role: 'MEMBER',
        city_id: 'city-01',
      })
    }

    const { users } = await sut.execute({
      items: 10,
      page: 3,
    })

    expect(users).toHaveLength(2)
  })

  it('should be able fetch users by specifc filters', async () => {
    await usersRepository.create({
      name: 'John Doe',
      cpf: '12345678910',
      password: 'password',
      email: 'johndoe@example.com',
      role: 'MEMBER',
      city_id: 'city-01',
    })

    await usersRepository.create({
      name: 'Joao da Silva',
      cpf: '12345678911',
      password: 'password',
      email: 'joaosilva@example.com',
      role: 'SECRETARY',
      city_id: 'city-01',
    })

    await usersRepository.create({
      name: 'Mario Silva',
      cpf: '12345678912',
      password: 'password',
      email: 'mariosilva@example.com',
      role: 'SECRETARY',
      city_id: 'city-01',
    })

    const { users } = await sut.execute({
      page: 1,
      items: 10,
      name: 'silva',
    })

    expect(users).toHaveLength(2)
  })
})
