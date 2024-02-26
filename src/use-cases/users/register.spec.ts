import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists'
import { compare } from 'bcryptjs'
import { InMemoryCitiesRepository } from '@/repositories/in-memory/in-memory-cities-repository'

let userRepository: InMemoryUsersRepository
let citiesRepository: InMemoryCitiesRepository
let sut: RegisterUseCase

describe('Register Users Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    citiesRepository = new InMemoryCitiesRepository()
    sut = new RegisterUseCase(userRepository, citiesRepository)

    await citiesRepository.create({
      id: 'city-1',
      name: 'Sacramento',
      state: 'MG',
    })
  })

  it('should be hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Eduardo Rodrigues',
      email: 'edurodrigues@example.com',
      cpf: '123.456.789-10',
      role: 'MEMBER',
      cityId: 'city-1',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123.456.789-10',
      user.password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('not should be able register with same cpf twice', async () => {
    const cpf = '123.456.789-10'

    await sut.execute({
      name: 'Eduardo Rodrigues',
      email: 'edurodrigues@example.com',
      cpf,
      role: 'MEMBER',
      cityId: 'city-1',
    })

    await expect(() =>
      sut.execute({
        name: 'Eduardo Rodrigues',
        email: 'edurodrigues@example.com',
        cpf,
        role: 'MEMBER',
        cityId: 'city-1',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('not should be able register with same email twice', async () => {
    const email = 'edurodrigues@example.com'

    await sut.execute({
      name: 'Eduardo Rodrigues',
      email,
      cpf: '08636379652',
      role: 'MEMBER',
      cityId: 'city-1',
    })

    await expect(() =>
      sut.execute({
        name: 'Eduardo Rodrigues',
        email,
        cpf: '08636379652',
        role: 'MEMBER',
        cityId: 'city-1',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able register a user', async () => {
    const { user } = await sut.execute({
      name: 'Eduardo Rodrigues',
      email: 'edurodrigues@example.com',
      cpf: '08636379652',
      role: 'MEMBER',
      cityId: 'city-1',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Eduardo Rodrigues')
  })
})
