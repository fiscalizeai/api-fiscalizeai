export class RecordsAlreadyExistsError extends Error {
  constructor() {
    super('Month records already exists.')
  }
}
