import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserInfoUseCase } from './get-user-info'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { UserNotFoundError } from '../errors/users/user-not-found'

let usersRepository: InMemoryUsersRepository
let sut: GetUserInfoUseCase

describe('Get User Info Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserInfoUseCase(usersRepository)
  })

  it('should be able to get user info', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '08636379652',
      password: await hash('08636379652', 6),
      role: 'MEMBER',
      city_id: 'city-01',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('John Doe')
  })

  it('not should be able to get user info with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
