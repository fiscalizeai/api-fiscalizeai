import { Transport } from '@prisma/client'
import { UsersRepository } from '@/repositories/users'
import { CitiesRepository } from '@/repositories/cities'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'
import { TransportRecordsRepository } from '@/repositories/transport'

interface RegisterTransportRecordsUseCaseRequest {
  month: Date
  cars: number
  bus: number
  machines: number
  total: number
  userId: string
  cityId: string
}

interface RegisterTransportRecordsUserCaseResponse {
  transport_record: Transport
}

export class RegisterTransportRecordsUseCase {
  constructor(
    private transportRecordsRepository: TransportRecordsRepository,
    private usersRepository: UsersRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    month,
    cars,
    bus,
    machines,
    total,
    cityId,
    userId,
  }: RegisterTransportRecordsUseCaseRequest): Promise<RegisterTransportRecordsUserCaseResponse> {
    const city = await this.citiesRepository.findById(cityId)
    const user = await this.usersRepository.findById(userId)

    if (!city && !user) {
      throw new InvalidUserOrCityError()
    }

    const hasSameTransportRecord =
      await this.transportRecordsRepository.findByMonthAndYear(month)

    if (hasSameTransportRecord && hasSameTransportRecord.city_id === cityId) {
      throw new RecordsAlreadyExistsError()
    }

    const monthUTC = new Date(month)

    const transport_record = await this.transportRecordsRepository.register({
      month: monthUTC,
      cars,
      bus,
      machines,
      total,
      city_id: cityId,
      user_id: userId,
    })

    return {
      transport_record,
    }
  }
}
