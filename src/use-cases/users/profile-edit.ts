import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users'
import { compare, hash } from 'bcryptjs'
import { UserNotFoundError } from '../errors/users/user-not-found'
import { OldPasswordNotMatchError } from '../errors/users/old-password-not-match'
import { EmailAlreadyInUseError } from '../errors/users/email-already-in-use'

interface ProfileEditUserUseCaseRequest {
  userId: string
  old_password?: string
  data: Prisma.UserUncheckedUpdateInput
}

interface ProfileEditUserUseCaseResponse {
  userEdited: User | null
}

export class ProfileEditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    old_password,
    data,
  }: ProfileEditUserUseCaseRequest): Promise<ProfileEditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (data.email) {
      const userWithUpdatedEmail = await this.usersRepository.findByEmail(
        data.email.toString(),
      )

      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new EmailAlreadyInUseError()
      }
    }

    const { password } = user

    let password_hash

    if (data.password && !old_password) {
      throw new OldPasswordNotMatchError()
    }

    if (data.password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new OldPasswordNotMatchError()
      }

      password_hash = await hash(data.password.toString(), 6)
    }

    const userEdited = await this.usersRepository.edit(userId, {
      ...data,
      password: password_hash || password,
    })

    return {
      userEdited,
    }
  }
}
