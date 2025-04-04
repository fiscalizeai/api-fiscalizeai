/* Interfaces criadas para as query params nas rotas de fetch */

type Role = 'ADMIN' | 'MEMBER' | 'SECRETARY'
type Status = 'ACCEPTED' | 'DENIED'

export interface UserFilters {
  name?: string
  cpf?: string
  city?: string
  state?: string
  role?: Role
  status?: Status
}

export interface CityFilters {
  name?: string
  state?: string
}

export interface TransferFilters {
  demonstrative?: string
}
