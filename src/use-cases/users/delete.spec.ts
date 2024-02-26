import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { DeleteUserUseCase } from './delete'
import { UserNotFoundError } from '../errors/users/user-not-found'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should be able delete user', async () => {
    const userToDelete = usersRepository.create({
      id: 'user-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      cpf: '123.456.789-10',
      city_id: 'city-1',
    })

    await sut.execute({
      id: (await userToDelete).id,
    })

    const deletedUser = await usersRepository.findById((await userToDelete).id)
    expect(deletedUser).toBeNull()
  })

  it('not should be able delete user with not exists', async () => {
    await expect(() =>
      sut.execute({
        id: 'user-not-exists-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
