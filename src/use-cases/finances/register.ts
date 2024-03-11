import { CitiesRepository } from '@/repositories/cities'
import { FinancesRepository } from '@/repositories/finance'
import { UsersRepository } from '@/repositories/users'
import { Finance } from '@prisma/client'
import { InvalidUserOrCityError } from '../errors/records/invalid-user-or-city'
import { RecordsAlreadyExistsError } from '../errors/records/record-already-exists'

interface FinancesUseCaseRequest {
  month: number
  year: number
  iptu: number
  iss: number
  itbi: number
  userId: string
  cityId: string
}

interface FinancesUseCaseResponse {
  finance: Finance
}

export class RegisterFinancesUseCase {
  constructor(
    private financesRepository: FinancesRepository,
    private usersRepositoty: UsersRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({
    month,
    year,
    iptu,
    iss,
    itbi,
    userId,
    cityId,
  }: FinancesUseCaseRequest): Promise<FinancesUseCaseResponse> {
    const city = await this.citiesRepository.findById(cityId)
    const user = await this.usersRepositoty.findById(userId)

    if (!city || !user) {
      throw new InvalidUserOrCityError()
    }

    const hasSameFinance = await this.financesRepository.findByMonthAndYear(
      month,
      year,
      cityId,
    )

    if (hasSameFinance && hasSameFinance.city_id === cityId) {
      throw new RecordsAlreadyExistsError()
    }

    const finance = await this.financesRepository.register({
      month,
      year,
      iptu,
      iss,
      itbi,
      city_id: cityId,
      user_id: userId,
    })

    return {
      finance,
    }
  }
}
