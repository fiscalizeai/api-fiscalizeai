import path from 'node:path'
import { rimraf } from 'rimraf'

const tmpFolderPath = path.join(__dirname, '../tmp')

export function deleteTmpFolder() {
  rimraf(tmpFolderPath)
}
