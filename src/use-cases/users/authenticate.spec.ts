import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials'
import { ResouceNotFoundError } from '../errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('exact-password', 6),
      city_id: 'city-01',
      role: 'MEMBER',
      cpf: '12345678910',
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: 'exact-password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('exact-password', 6),
      city_id: 'city-01',
      role: 'MEMBER',
      cpf: '12345678910',
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong-email',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to athenticate with denied status', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('12345678910', 6),
      city_id: 'city-01',
      cpf: '12345678910',
      role: 'MEMBER',
      status: 'DENIED',
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '12345678910',
      }),
    ).rejects.toBeInstanceOf(ResouceNotFoundError)
  })
})
