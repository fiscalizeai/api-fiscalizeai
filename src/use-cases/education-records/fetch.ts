import { EducationRecordsRepository } from '@/repositories/education'
import { Education } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface FetchEducationRecordsUseCaseRequest {
  page: number
  chamberId: string
  items: number
  date?: Date
}

interface FetchEducationRecordsUseCaseResponse {
  education: Education[]
  pagination: {
    totalItems: number
    pageSize: number
    pageNumber: number
  }
}

export class FetchEducationRecordsUseCase {
  constructor(private educationRepository: EducationRecordsRepository) {}

  async execute({
    page,
    chamberId,
    items,
    date,
  }: FetchEducationRecordsUseCaseRequest): Promise<FetchEducationRecordsUseCaseResponse> {
    const educationRecords = await this.educationRepository.fetch(
      page,
      chamberId,
      items,
      date,
    )

    if (!educationRecords) {
      throw new ResouceNotFoundError()
    }

    const { education, pagination } = educationRecords

    return {
      education,
      pagination,
    }
  }
}
