import { Education } from '@prisma/client'
import { EducationRecordsRepository } from '@/repositories/education'
import { UsersRepository } from '@/repositories/users'
import { ChambersRepository } from '@/repositories/chambers'
import { ResouceNotFoundError } from '../errors/resource-not-found'
import { EducationRecordsAlreadyExistsError } from '../errors/education/education-record-already-exists'
import { InvalidUserOrChamberError } from '../errors/education/invalid-user-or-chamber'

interface RegisterEducationRecordsUseCaseRequest {
  month: Date
  schools: number
  students: number
  teachers: number
  total: number
  userId: string
  chamberId: string
}

interface RegisterEducationRecordsUserCaseResponse {
  education_record: Education
}

export class RegisterEducationRecordsUseCase {
  constructor(
    private educationRecordsRepository: EducationRecordsRepository,
    private usersRepository: UsersRepository,
    private chambersRepository: ChambersRepository,
  ) {}

  async execute({
    month,
    schools,
    students,
    teachers,
    total,
    chamberId,
    userId,
  }: RegisterEducationRecordsUseCaseRequest): Promise<RegisterEducationRecordsUserCaseResponse> {
    const chamber = await this.chambersRepository.findById(chamberId)
    const user = await this.usersRepository.findById(userId)

    if (!chamber && !user) {
      throw new InvalidUserOrChamberError()
    }

    const hasSameEducationRecord =
      await this.educationRecordsRepository.findByMonthAndYear(month)

    if (
      hasSameEducationRecord &&
      hasSameEducationRecord.chamber_id === chamberId
    ) {
      console.log(hasSameEducationRecord.chamber_id, chamberId, 'ids')
      throw new EducationRecordsAlreadyExistsError()
    }

    const monthUTC = new Date(month)

    const education_record = await this.educationRecordsRepository.register({
      month: monthUTC,
      schools,
      students,
      teachers,
      total,
      chamber_id: chamberId,
      user_id: userId,
    })

    return {
      education_record,
    }
  }
}
