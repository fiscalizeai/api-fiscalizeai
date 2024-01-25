import { saveDataToPrisma } from '@/utils/save-data-to-prisma'
import fs from 'node:fs/promises'
import path from 'node:path'

interface SubData {
  parcel: string
  value: string
  date: Date
}

interface RowData {
  demonstrative: string
  parcels: SubData[]
  cityId: string
}

async function processTmpFiles() {
  const tmpFolderPath = path.join(__dirname, '../tmp')

  try {
    const files = await fs.readdir(tmpFolderPath)

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(tmpFolderPath, file)
        const fileName = path.basename(filePath)
        const fileContent = await fs.readFile(filePath, 'utf-8')

        try {
          const jsonData: RowData[] = JSON.parse(fileContent)
          await saveDataToPrisma(fileName, jsonData)
        } catch (error) {
          console.error(
            'Erro ao processar e salvar dados do arquivo no prisma',
            error,
          )
        }
      }
    }
  } catch (error) {
    console.error('Erro ao ler arquivos da pasta tmp:', error)
  }
}

processTmpFiles()
