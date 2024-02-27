import path from 'node:path'
import fs from 'node:fs'

const tmpFolderPath = path.join(__dirname, '../tmp')

function deleteTmpFiles() {
  // Lendo o conteudo da pasta tmp
  fs.readdir(tmpFolderPath, (error, files) => {
    // Verificando se ocorreu algum erro durante a leitura
    if (error) {
      console.error(`Erro ao ler a pasta ${tmpFolderPath}`, error)
      return
    }

    // Intera sobre a lista de arquivos e os apaga
    files.forEach((file) => {
      const pathFile = path.join(tmpFolderPath, file)
      // Excluindo o arquivo
      fs.unlink(pathFile, (error) => {
        if (error) {
          return console.error(`Erro ao excluir o arquivo ${pathFile}`, error)
        } else {
          return console.log(`O arquivo ${pathFile} foi excluido`)
        }
      })
    })
  })
}

deleteTmpFiles()
