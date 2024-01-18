import { Person } from '@prisma/client'
import { PersonRecordsRepository } from '@/repositories/person'
import { UsersRepository } from '@/repositories/users'
import { ChambersRepository } from '@/repositories/chambers'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'
import { InvalidUserOrChamberError } from '../errors/records/invalid-user-or-chamber'

interface RegisterPersonRecordsUseCaseRequest {
  month: Date
  contractors: number
  headcounts: number
  staffs: number
  total: number
  userId: string
  chamberId: string
}

interface RegisterPersonRecordsUserCaseResponse {
  personRecord: Person
}

export class RegisterPersonRecordsUseCase {
  constructor(
    private personRecordsRepository: PersonRecordsRepository,
    private usersRepository: UsersRepository,
    private chambersRepository: ChambersRepository,
  ) {}

  async execute({
    month,
    contractors,
    headcounts,
    staffs,
    total,
    chamberId,
    userId,
  }: RegisterPersonRecordsUseCaseRequest): Promise<RegisterPersonRecordsUserCaseResponse> {
    const chamber = await this.chambersRepository.findById(chamberId)
    const user = await this.usersRepository.findById(userId)

    if (!chamber && !user) {
      throw new InvalidUserOrChamberError()
    }

    const hasSamePersonRecord =
      await this.personRecordsRepository.findByMonthAndYear(month)

    if (hasSamePersonRecord && hasSamePersonRecord.chamber_id === chamberId) {
      throw new RecordsAlreadyExistsError()
    }

    const monthUTC = new Date(month)

    const personRecord = await this.personRecordsRepository.register({
      month: monthUTC,
      contractors,
      headcounts,
      staffs,
      total,
      chamber_id: chamberId,
      user_id: userId,
    })

    return {
      personRecord,
    }
  }
}
