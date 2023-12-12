import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserByCpfUseCase } from './get-user-by-cpf'

let userRepository: InMemoryUsersRepository
let sut: GetUserByCpfUseCase

describe('Register Users Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserByCpfUseCase(userRepository)
  })

  it('should be able to get user by cpf', async () => {
    for (let i = 1; i <= 5; i++) {
      await userRepository.create({
        name: `Vereador ${i}`,
        cpf: `1234567890${i}`,
        password: 'password',
        email: `vereador${i}@example.com`,
        chamber_id: 'chamber-01',
      })
    }

    const { user } = await sut.execute({
      cpf: '12345678905',
    })

    expect(user?.name).toEqual('Vereador 5')
  })
})
