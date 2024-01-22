import { Health } from '@prisma/client'
import { HealthRecordsRepository } from '@/repositories/health'
import { UsersRepository } from '@/repositories/users'
import { CitysRepository } from '@/repositories/cities'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'

interface RegisterHealthRecordsUseCaseRequest {
  month: Date
  doctors: number
  services: number
  total: number
  userId: string
  cityId: string
}

interface RegisterHealthRecordsUserCaseResponse {
  health_record: Health
}

export class RegisterHealthRecordsUseCase {
  constructor(
    private healthRecordsRepository: HealthRecordsRepository,
    private usersRepository: UsersRepository,
    private citiesRepository: CitysRepository,
  ) {}

  async execute({
    month,
    doctors,
    services,
    total,
    cityId,
    userId,
  }: RegisterHealthRecordsUseCaseRequest): Promise<RegisterHealthRecordsUserCaseResponse> {
    const city = await this.citiesRepository.findById(cityId)
    const user = await this.usersRepository.findById(userId)

    if (!city && !user) {
      throw new InvalidUserOrCityError()
    }

    const hasSameHealthRecord =
      await this.healthRecordsRepository.findByMonthAndYear(month)

    if (hasSameHealthRecord && hasSameHealthRecord.city_id === cityId) {
      throw new RecordsAlreadyExistsError()
    }

    const monthUTC = new Date(month)

    const health_record = await this.healthRecordsRepository.register({
      month: monthUTC,
      doctors,
      services,
      total,
      city_id: cityId,
      user_id: userId,
    })

    return {
      health_record,
    }
  }
}
