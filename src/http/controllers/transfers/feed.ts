import path from 'path'
import fs from 'node:fs/promises'

import { saveDataToPrisma } from '@/utils/save-data-to-prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function feed(request: FastifyRequest, reply: FastifyReply) {
  const tmpFolderPath = path.join(__dirname, '../../../tmp')

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
          const jsonData = JSON.parse(fileContent)

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
    return reply.status(400).send()
  }

  return reply.status(200).send()
}
