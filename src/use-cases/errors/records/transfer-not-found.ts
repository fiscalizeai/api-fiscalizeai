export class TransferNotFoundError extends Error {
  constructor() {
    super('Transfer not exists.')
  }
}
