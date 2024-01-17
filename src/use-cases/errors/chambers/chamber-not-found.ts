export class ChamberNotFoundError extends Error {
  constructor() {
    super('Chamber not found.')
  }
}
