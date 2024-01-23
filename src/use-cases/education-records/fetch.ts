import { EducationRecordsRepository } from '@/repositories/education'
import { Education } from '@prisma/client'
import { ResouceNotFoundError } from '../errors/resource-not-found'

interface FetchEducationRecordsUseCaseRequest {
  page: number
  cityId: string
  items: number
  month?: number
  year?: number
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
    cityId,
    items,
    month,
    year,
  }: FetchEducationRecordsUseCaseRequest): Promise<FetchEducationRecordsUseCaseResponse> {
    const educationRecords = await this.educationRepository.fetch(
      page,
      cityId,
      items,
      month,
      year,
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
