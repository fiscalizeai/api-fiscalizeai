import { Chamber } from '@prisma/client'
import { ChamberRecordsRepository } from '@/repositories/chamber'
import { UsersRepository } from '@/repositories/users'
import { CitiesRepository } from '@/repositories/cities'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'

interface RegisterChamberRecordsUseCaseRequest {
  month: number
  year: number
  contractors: number
  headcounts: number
  staffs: number
  total: number
  userId: string
  cityId: string
}

interface RegisterChamberRecordsUserCaseResponse {
  chamberRecord: Chamber
}

export class RegisterChamberRecordsUseCase {
  constructor(
    private chamberRecordsRepository: ChamberRecordsRepository,
    private usersRepository: UsersRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    month,
    year,
    contractors,
    headcounts,
    staffs,
    total,
    cityId,
    userId,
  }: RegisterChamberRecordsUseCaseRequest): Promise<RegisterChamberRecordsUserCaseResponse> {
    const city = await this.citiesRepository.findById(cityId)
    const user = await this.usersRepository.findById(userId)

    if (!city || !user) {
      throw new InvalidUserOrCityError()
    }

    const hasSameChamberRecord =
      await this.chamberRecordsRepository.findByMonthAndYear(
        month,
        year,
        cityId,
      )

    if (hasSameChamberRecord && hasSameChamberRecord.city_id === cityId) {
      throw new RecordsAlreadyExistsError()
    }

    const chamberRecord = await this.chamberRecordsRepository.register({
      month,
      year,
      contractors,
      headcounts,
      staffs,
      total,
      city_id: cityId,
      user_id: userId,
    })

    return {
      chamberRecord,
    }
  }
}
