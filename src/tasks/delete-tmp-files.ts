import path from 'node:path'
import fs from 'node:fs'

const tmpFolderPath = path.join(__dirname, '../../tmp')

export function deleteTmpFiles() {
  fs.readdir(tmpFolderPath, (error, files) => {
    if (error) {
      console.error(`Erro ao ler a pasta ${tmpFolderPath}`, error)
      return
    }

    // Intera sobre a lista de arquivos e os apaga
    files.forEach((file) => {
      const pathFile = path.join(tmpFolderPath, file)

      fs.unlink(pathFile, (error) => {
        if (error) {
          console.error(`Erro ao excluir o arquivo ${pathFile}`, error)
        } else {
          console.log(`O arquivo ${pathFile} foi excluido`)
        }
      })
    })
  })
}
