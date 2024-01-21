import { Education } from '@prisma/client'
import { EducationRecordsRepository } from '@/repositories/education'
import { UsersRepository } from '@/repositories/users'
import { CitysRepository } from '@/repositories/citys'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'

interface RegisterEducationRecordsUseCaseRequest {
  month: Date
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
    private citysRepository: CitysRepository,
  ) {}

  async execute({
    month,
    schools,
    students,
    teachers,
    total,
    cityId,
    userId,
  }: RegisterEducationRecordsUseCaseRequest): Promise<RegisterEducationRecordsUserCaseResponse> {
    const city = await this.citysRepository.findById(cityId)
    const user = await this.usersRepository.findById(userId)

    if (!city && !user) {
      throw new InvalidUserOrCityError()
    }

    const hasSameEducationRecord =
      await this.educationRecordsRepository.findByMonthAndYear(month)

    if (
      hasSameEducationRecord &&
      hasSameEducationRecord.city_id === cityId
    ) {
      throw new RecordsAlreadyExistsError()
    }

    const monthUTC = new Date(month)

    const education_record = await this.educationRecordsRepository.register({
      month: monthUTC,
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
