import fs from 'node:fs'
import path from 'node:path'
import { launch, Browser, Page } from 'puppeteer'
import { setTimeout } from 'node:timers'
import { model, promptModel } from '@/lib/gemini'

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

async function initialPageWebBanking(page: Page, cityName: string) {
  if (!page || !cityName) {
    throw new Error('Page or cityName as wrong.')
  }

  const beneficiarySelector =
    '#root > div.apw-root-jss1.apw-root-jss4 > div.apw-root-jss2 > apw-ng-app > app-template > bb-layout > div > div > div > div > div > bb-layout-column > ng-component > div > div > div > app-demonstrativo-daf > form > div > div > div > bb-card > bb-card-body > bb-text-field > div'

  await page.waitForNetworkIdle({
    idleTime: 3000,
  })

  await page.waitForSelector(beneficiarySelector)
  await page.click(beneficiarySelector)
  await page.type(beneficiarySelector, cityName)

  const beneficiaryFormSubmitSelector =
    '#root > div.apw-root-jss1.apw-root-jss4 > div.apw-root-jss2 > apw-ng-app > app-template > bb-layout > div > div > div > div > div > bb-layout-column > ng-component > div > div > div > app-demonstrativo-daf > form > div > div > div > bb-card > bb-card-footer > div:nth-child(2) > button'

  page.click(beneficiaryFormSubmitSelector)

  page.waitForNavigation()
}

async function formPageWebBanking(page: Page, date: string) {
  const initialDateSelector =
    '#root > div.apw-root-jss1.apw-root-jss4 > div.apw-root-jss2 > apw-ng-app > app-template > bb-layout > div.scrollable-container > div > div > div > div > bb-layout-column > ng-component > div > div > div > app-demonstrativo-daf-selecao > div > div:nth-child(2) > div > div > form > bb-card > bb-card-body > div:nth-child(2) > bb-date-field > bb-text-field > div'
  const endDateSelector =
    '#root > div.apw-root-jss1.apw-root-jss4 > div.apw-root-jss2 > apw-ng-app > app-template > bb-layout > div.scrollable-container > div > div > div > div > bb-layout-column > ng-component > div > div > div > app-demonstrativo-daf-selecao > div > div:nth-child(2) > div > div > form > bb-card > bb-card-body > div:nth-child(3) > bb-date-field > bb-text-field > div'

  await page.waitForSelector(initialDateSelector)
  await page.waitForSelector(endDateSelector)

  await page.click(initialDateSelector)
  await page.type(initialDateSelector, date)

  await page.click(endDateSelector)
  await page.type(endDateSelector, date)

  const demonstrativeFormSubmitSelector =
    '#root > div.apw-root-jss1.apw-root-jss4 > div.apw-root-jss2 > apw-ng-app > app-template > bb-layout > div.scrollable-container > div > div > div > div > bb-layout-column > ng-component > div > div > div > app-demonstrativo-daf-selecao > div > div:nth-child(2) > div > div > form > bb-card > bb-card-footer > div > button.bb-button.primary.size-regular'

  page.click(demonstrativeFormSubmitSelector)

  page.waitForNavigation()
}

async function demonstrativePageWebBanking(page: Page) {
  const demonstrativeTableSelector =
    '#root > div.apw-root-jss1.apw-root-jss4 > div.apw-root-jss2 > apw-ng-app > app-template > bb-layout > div.scrollable-container > div > div > div > div > bb-layout-column > ng-component > div > div > div > app-demonstrativo-daf-final > div > div:nth-child(2) > div > div > bb-card > bb-card-body > div > table'

  await page.waitForSelector(demonstrativeTableSelector)
}

async function downloadContentWebBaking(page: Page) {
  const downloadIconSelector =
    '#root > div.apw-root-jss1.apw-root-jss4 > div.apw-root-jss2 > apw-ng-app > app-template > bb-layout > div.scrollable-container > div > div > div > div > bb-layout-column > ng-component > div > div > div > app-demonstrativo-daf-final > div > div:nth-child(2) > div > div > bb-card > bb-card-header > bb-card-header-action > button > bb-icon'
  await page.waitForSelector(downloadIconSelector)
  setTimeout(async () => await page.click(downloadIconSelector), 1500)

  const menuDownloadSelector = '[id^="cdk-overlay-"] > bb-select-menu > bb-menu'
  await page.waitForSelector(menuDownloadSelector, {
    hidden: true,
  })

  const textOptionSelector =
    '[id^="cdk-overlay-"] > bb-select-menu > bb-menu > ul > li:nth-child(3) > a'
  await page.waitForSelector(textOptionSelector, {
    visible: true,
  })

  await page.click(textOptionSelector, {
    delay: 1000,
  })
}

async function renameFile(pathFile: string, fileName: string): Promise<void> {
  const oldFilePath = `${pathFile}/demonstrativoDAF.txt`
  const newFilePath = `${pathFile}/${fileName}`

  while (!fs.existsSync(oldFilePath)) {
    setTimeout(() => 1000)
  }

  try {
    await fs.promises.rename(oldFilePath, newFilePath)
  } catch (err) {
    throw new Error('Erro on rename file.')
  }
}

async function readFile(pathFile: string, fileName: string): Promise<string> {
  try {
    const data = await fs.promises.readFile(`${pathFile}/${fileName}`, 'utf8')
    return data
  } catch (err) {
    console.error(err)
    throw new Error('Error on read file.')
  }
}

async function deleteFile(pathFile: string, fileName: string) {
  fs.unlink(`${pathFile}/${fileName}`, function (err) {
    if (err) {
      throw err
    }
  })
}

export async function getDatasWebBanking(
  cityId: string,
  cityName: string,
  date: string,
) {
  let browser: Browser | null = null
  let page: Page | null = null

  // Extrair os componentes da data
  const day = parseInt(date.substring(0, 2), 10)
  const month = parseInt(date.substring(2, 4), 10) - 1 // Os meses em JavaScript são baseados em zero (0 a 11)
  const year = parseInt(date.substring(4, 8), 10)

  const formattedDate = new Date(year, month, day)

  try {
    browser = await launch({
      headless: false,
    })

    page = await browser.newPage()
    await page.goto('https://demonstrativos.apps.bb.com.br/arrecadacao-federal')

    await initialPageWebBanking(page, cityName)

    await formPageWebBanking(page, date)

    await demonstrativePageWebBanking(page)

    await downloadContentWebBaking(page)

    const pathFile = '/home/edurodrigues/Downloads'
    const fileName = `${cityName}_${date}.txt`

    await renameFile(pathFile, fileName)

    const data = await readFile(pathFile, fileName)

    await deleteFile(pathFile, fileName)

    const prompt = promptModel(data)

    const result = await model.generateContent([prompt])
    console.log(result.response.text())
  } catch (err) {
    console.error(err)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// async function extractDatas($: CheerioAPI, data: RowData[], cityId: string) {
//   $('tr').each((index, element) => {
//     const rowData = {
//       demonstrative: '',
//       parcels: [] as SubData[],
//       cityId,
//     }

//     // Nome do demonstrativo
//     rowData.demonstrative = $(element)
//       .find('.rich-table-cell')
//       .text()
//       .replace(/\s+/g, ' ')
//       .trim()

//     console.log('demonstrative =>', rowData.demonstrative)

//     // Sub-tabelas para as parcelas
//     $(element)
//       .nextUntil('tr.rich-table-row.even', 'tr.rich-subtable-row')
//       .each((subIndex, subElement) => {
//         const subData = {
//           date: new Date(), // Pode ajustar a data conforme necessário
//           parcel: '',
//           value: '',
//         }

//         subData.parcel = $(subElement)
//           .find('.rich-subtable-cell.texto1')
//           .text()
//           .trim()

//         subData.value = $(subElement)
//           .find('.rich-subtable-cell.extratoValorPositivoAlinhaDireita')
//           .text()
//           .slice(2)
//           .trim()

//         // Filtro para incluir apenas dados relevantes
//         if (
//           ['CREDITO BENEF.', 'CREDITO FUNDO'].includes(subData.parcel) &&
//           subData.value
//         ) {
//           const valorFormatado = subData.value
//             .replace('C', '')
//             .replace(',', '.')
//           subData.value = String(parseFloat(valorFormatado.replace(/\./g, '')))
//           rowData.parcels.push(subData)
//         }
//       })

//     console.log('data =>', rowData)

//     if (rowData.parcels.length > 0) {
//       data.push(rowData)
//     }
//   })
// }
