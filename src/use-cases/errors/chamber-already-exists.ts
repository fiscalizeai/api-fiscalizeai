export class ChamberAlreadyExistsError extends Error {
  constructor() {
    super('Chamber already exists.')
  }
}
