import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: 'ADMIN' | 'MEMBER' | 'SECRETARY'
      city: string
    } // user type is return type of 'request.user' object
  }
}
