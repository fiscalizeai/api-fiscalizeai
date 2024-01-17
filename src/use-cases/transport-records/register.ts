import { Transport } from '@prisma/client'
import { UsersRepository } from '@/repositories/users'
import { ChambersRepository } from '@/repositories/chambers'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrChamberError } from '../errors/records/invalid-user-or-chamber'
import { TransportRecordsRepository } from '@/repositories/transport'

interface RegisterTransportRecordsUseCaseRequest {
  month: Date
  cars: number
  bus: number
  machines: number
  total: number
  userId: string
  chamberId: string
}

interface RegisterTransportRecordsUserCaseResponse {
  transport_record: Transport
}

export class RegisterTransportRecordsUseCase {
  constructor(
    private transportRecordsRepository: TransportRecordsRepository,
    private usersRepository: UsersRepository,
    private chambersRepository: ChambersRepository,
  ) {}

  async execute({
    month,
    cars,
    bus,
    machines,
    total,
    chamberId,
    userId,
  }: RegisterTransportRecordsUseCaseRequest): Promise<RegisterTransportRecordsUserCaseResponse> {
    const chamber = await this.chambersRepository.findById(chamberId)
    const user = await this.usersRepository.findById(userId)

    if (!chamber && !user) {
      throw new InvalidUserOrChamberError()
    }

    const hasSameTransportRecord =
      await this.transportRecordsRepository.findByMonthAndYear(month)

    if (
      hasSameTransportRecord &&
      hasSameTransportRecord.chamber_id === chamberId
    ) {
      throw new RecordsAlreadyExistsError()
    }

    const monthUTC = new Date(month)

    const transport_record = await this.transportRecordsRepository.register({
      month: monthUTC,
      cars,
      bus,
      machines,
      total,
      chamber_id: chamberId,
      user_id: userId,
    })

    return {
      transport_record,
    }
  }
}
