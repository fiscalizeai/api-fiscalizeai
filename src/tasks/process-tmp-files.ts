import { saveDataToPrisma } from '@/utils/save-data-to-prisma'
import fs from 'node:fs/promises'
import path from 'node:path'

/* Interface Props */
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

// Função assincrona para processar arquivos temporários
async function processTmpFiles() {
  // Caminha da pasta temporaria
  const tmpFolderPath = path.join(__dirname, '../tmp')

  try {
    // Lendo os arquivos na pasta temporaria
    const files = await fs.readdir(tmpFolderPath)

    // Iterando sobre os arquivos
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(tmpFolderPath, file) // Caminho do arquivo
        const fileName = path.basename(filePath) // Nome do arquivo
        const fileContent = await fs.readFile(filePath, 'utf-8') // Lendo o conteudo do arquivo como string

        try {
          // Convertendo o conteudo do arquivo JSON para um array de objetos
          const jsonData: RowData[] = JSON.parse(fileContent)
          // Salvando os dados no Prisma usando funcao saveDateToPrisma que esta dentro da pasta utils
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
