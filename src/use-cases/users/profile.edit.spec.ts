import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { EmailAlreadyInUseError } from '../errors/users/email-already-in-use'
import { ProfileEditUserUseCase } from './profile-edit'
import { OldPasswordNotMatchError } from '../errors/users/old-password-not-match'

let usersRepository: InMemoryUsersRepository
let sut: ProfileEditUserUseCase

describe('Profile Edit Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ProfileEditUserUseCase(usersRepository)

    await usersRepository.create({
      id: 'user-02',
      name: 'John Doe',
      cpf: '123.456.789-10',
      email: 'johndoe1@example.com',
      password: await hash('123.456.789-10', 6),
      city_id: 'city-01',
    })

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      cpf: '123.456.789-10',
      email: 'johndoe@example.com',
      password: await hash('123.456.789-10', 6),
      city_id: 'city-01',
    })
  })

  it('should be able edit profile', async () => {
    const { userEdited } = await sut.execute({
      userId: 'user-01',
      data: {
        name: 'Eduardo Rodrigues',
        email: 'edurodrigues@example.com',
      },
    })

    expect(userEdited).not.toEqual(null)
    expect.objectContaining({ userEdited })
  })

  it('not should be able edit profile with same email', async () => {
    expect(() =>
      sut.execute({
        userId: 'user-01',
        data: {
          email: 'johndoe1@example.com',
        },
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })

  it('not should be able edit profile with wrong old password', async () => {
    expect(() =>
      sut.execute({
        userId: 'user-01',
        old_password: '12345678910',
        data: {
          password: 'new password',
        },
      }),
    ).rejects.toBeInstanceOf(OldPasswordNotMatchError)
  })
})
