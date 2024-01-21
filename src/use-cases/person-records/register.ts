import { Person } from '@prisma/client'
import { PersonRecordsRepository } from '@/repositories/person'
import { UsersRepository } from '@/repositories/users'
import { CitysRepository } from '@/repositories/citys'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'

interface RegisterPersonRecordsUseCaseRequest {
  month: Date
  contractors: number
  headcounts: number
  staffs: number
  total: number
  userId: string
  cityId: string
}

interface RegisterPersonRecordsUserCaseResponse {
  personRecord: Person
}

export class RegisterPersonRecordsUseCase {
  constructor(
    private personRecordsRepository: PersonRecordsRepository,
    private usersRepository: UsersRepository,
    private citysRepository: CitysRepository,
  ) {}

  async execute({
    month,
    contractors,
    headcounts,
    staffs,
    total,
    cityId,
    userId,
  }: RegisterPersonRecordsUseCaseRequest): Promise<RegisterPersonRecordsUserCaseResponse> {
    const city = await this.citysRepository.findById(cityId)
    const user = await this.usersRepository.findById(userId)

    if (!city && !user) {
      throw new InvalidUserOrCityError()
    }

    const hasSamePersonRecord =
      await this.personRecordsRepository.findByMonthAndYear(month)

    if (hasSamePersonRecord && hasSamePersonRecord.city_id === cityId) {
      throw new RecordsAlreadyExistsError()
    }

    const monthUTC = new Date(month)

    const personRecord = await this.personRecordsRepository.register({
      month: monthUTC,
      contractors,
      headcounts,
      staffs,
      total,
      city_id: cityId,
      user_id: userId,
    })

    return {
      personRecord,
    }
  }
}
