type Role = 'ADMIN' | 'MEMBER' | 'SECRETARY'
type Permission = 'ACCEPTED' | 'DENIED'

export interface UserFilters {
  name?: string
  cpf?: string
  city?: string
  state?: string
  role?: Role
  permission?: Permission
}

export interface ChamberFilters {
  name?: string
  state?: string
}
