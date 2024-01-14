export class RecordsNotExistsError extends Error {
  constructor() {
    super('Records not exists.')
  }
}
