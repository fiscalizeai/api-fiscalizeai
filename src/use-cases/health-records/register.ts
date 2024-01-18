import { Health } from '@prisma/client'
import { HealthRecordsRepository } from '@/repositories/health'
import { UsersRepository } from '@/repositories/users'
import { ChambersRepository } from '@/repositories/chambers'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrChamberError } from '../errors/records/invalid-user-or-chamber'

interface RegisterHealthRecordsUseCaseRequest {
  month: Date
  doctors: number
  services: number
  total: number
  userId: string
  chamberId: string
}

interface RegisterHealthRecordsUserCaseResponse {
  health_record: Health
}

export class RegisterHealthRecordsUseCase {
  constructor(
    private healthRecordsRepository: HealthRecordsRepository,
    private usersRepository: UsersRepository,
    private chambersRepository: ChambersRepository,
  ) {}

  async execute({
    month,
    doctors,
    services,
    total,
    chamberId,
    userId,
  }: RegisterHealthRecordsUseCaseRequest): Promise<RegisterHealthRecordsUserCaseResponse> {
    const chamber = await this.chambersRepository.findById(chamberId)
    const user = await this.usersRepository.findById(userId)

    if (!chamber && !user) {
      throw new InvalidUserOrChamberError()
    }

    const hasSameHealthRecord =
      await this.healthRecordsRepository.findByMonthAndYear(month)

    if (hasSameHealthRecord && hasSameHealthRecord.chamber_id === chamberId) {
      throw new RecordsAlreadyExistsError()
    }

    const monthUTC = new Date(month)

    const health_record = await this.healthRecordsRepository.register({
      month: monthUTC,
      doctors,
      services,
      total,
      chamber_id: chamberId,
      user_id: userId,
    })

    return {
      health_record,
    }
  }
}
