export class AccessDeniedError extends Error {
  constructor() {
    super('Access denied.')
  }
}
