export class OldPasswordNotMatchError extends Error {
  constructor() {
    super('Old password not match.')
  }
}
