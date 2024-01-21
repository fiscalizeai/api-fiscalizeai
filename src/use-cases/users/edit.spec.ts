import { expect, it, describe, beforeEach } from 'vitest'
import { EditUserUseCase } from './edit'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: EditUserUseCase

describe('Edit Users Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new EditUserUseCase(usersRepository)

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      cpf: '123.456.789-10',
      email: 'johndoe@example.com',
      password: await hash('123.456.789-10', 6),
      role: 'MEMBER',
      city_id: 'city-01',
    })
  })

  it('should be able edit user', async () => {
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
})
