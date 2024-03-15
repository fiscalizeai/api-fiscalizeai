import { Education } from '@prisma/client'
import { EducationRecordsRepository } from '@/repositories/education'
import { UsersRepository } from '@/repositories/users'
import { CitiesRepository } from '@/repositories/cities'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'
import { InvalidDateError } from '../errors/records/invalid-date'

interface RegisterEducationRecordsUseCaseRequest {
  month: number
  year: number
  schools: number
  students: number
  teachers: number
  total: number
  userId: string
  cityId: string
}

interface RegisterEducationRecordsUserCaseResponse {
  education_record: Education
}

export class RegisterEducationRecordsUseCase {
  constructor(
    private educationRecordsRepository: EducationRecordsRepository,
    private usersRepository: UsersRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    month,
    year,
    schools,
    students,
    teachers,
    total,
    cityId,
    userId,
  }: RegisterEducationRecordsUseCaseRequest): Promise<RegisterEducationRecordsUserCaseResponse> {
    const city = await this.citiesRepository.findById(cityId)
    const user = await this.usersRepository.findById(userId)

    if (!city && !user) {
      throw new InvalidUserOrCityError()
    }

    const hasSameEducationRecord =
      await this.educationRecordsRepository.findByMonthAndYear(
        month,
        year,
        cityId,
      )

    if (hasSameEducationRecord && hasSameEducationRecord.city_id === cityId) {
      throw new RecordsAlreadyExistsError()
    }

    const dateForVerification = new Date()

    if (
      month >= dateForVerification.getMonth() &&
      year > dateForVerification.getFullYear()
    ) {
      throw new InvalidDateError()
    }

    const education_record = await this.educationRecordsRepository.register({
      month,
      year,
      schools,
      students,
      teachers,
      total,
      city_id: cityId,
      user_id: userId,
    })

    return {
      education_record,
    }
  }
}
