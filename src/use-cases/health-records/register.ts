import { Health } from '@prisma/client'
import { HealthRecordsRepository } from '@/repositories/health'
import { UsersRepository } from '@/repositories/users'
import { CitiesRepository } from '@/repositories/cities'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'
import { InvalidDateError } from '../errors/records/invalid-date'

interface RegisterHealthRecordsUseCaseRequest {
  month: number
  year: number
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
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    month,
    year,
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
      await this.healthRecordsRepository.findByMonthAndYear(month, year, cityId)

    if (hasSameHealthRecord && hasSameHealthRecord.city_id === cityId) {
      throw new RecordsAlreadyExistsError()
    }

    const dateForVerification = new Date()

    if (
      month >= dateForVerification.getMonth() &&
      year > dateForVerification.getFullYear()
    ) {
      throw new InvalidDateError()
    }

    const health_record = await this.healthRecordsRepository.register({
      month,
      year,
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
