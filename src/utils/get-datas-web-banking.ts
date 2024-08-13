import fs from 'node:fs'
import path from 'node:path'

import { CheerioAPI, load } from 'cheerio'
import { launch, Browser, Page } from 'puppeteer'

/* Interfaces */
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

/* Funcao para obter dados do banco */
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

  // Criar um objeto de data
  const formattedDate = new Date(year, month, day)

  try {
    browser = await launch({
      headless: false,
    })

    page = await browser.newPage()

    await page.goto('https://demonstrativos.apps.bb.com.br/arrecadacao-federal')

    // Initial Page
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

    await Promise.all([
      page.click(beneficiaryFormSubmitSelector),
      page.waitForNavigation(),
    ])

    // Demonstrative Form
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

    await Promise.all([
      page.click(demonstrativeFormSubmitSelector),
      page.waitForNavigation(),
    ])

    // Demonstrative Page
    const demonstrativeTableSelector =
      '#root > div.apw-root-jss1.apw-root-jss4 > div.apw-root-jss2 > apw-ng-app > app-template > bb-layout > div.scrollable-container > div > div > div > div > bb-layout-column > ng-component > div > div > div > app-demonstrativo-daf-final > div > div:nth-child(2) > div > div > bb-card > bb-card-body > div > table'

    await page.waitForSelector(demonstrativeTableSelector)

    // Extract Data
    const pageData = await page.evaluate(() => {
      return {
        html: document.documentElement.innerHTML,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      }
    })

    const $ = load(pageData.html)
    const data: RowData[] = []

    // const $ = load(pageData.html)
    // const data: RowData[] = []

    await extractDatas($, data, cityId)

    // const tmpDir = path.join(__dirname, '../tmp')
    // console.log(tmpDir, 'local tmp')
    // if (!fs.existsSync(tmpDir)) {
    //   fs.mkdirSync(tmpDir)
    // }

    // screvendo os dados em um arquivo JSON na pasta tmp
    // const fileName = `${cityName}_${date}.json`
    // const filePath = path.join(tmpDir, fileName)
    // fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    if (browser) {
      // await browser.close()
    }
  }
}

async function extractDatas($: CheerioAPI, data: RowData[], cityId: string) {
  $('tr.rich-table-row.even').each((index, element) => {
    const rowData: RowData = {
      demonstrative: '',
      parcels: [],
      cityId,
    }

    // Obter o nome do demonstrativo
    rowData.demonstrative = $(element)
      .find('.rich-table-cell')
      .text()
      .replace(/\s+/g, ' ')
      .trim()

    // Obter as informações das sub-tabelas
    $(element)
      .nextUntil('tr.rich-table-row.even', 'tr.rich-subtable-row')
      .each((subIndex, subElement) => {
        const subData: SubData = {
          date: formattedDate,
          parcel: '',
          value: '',
        }
        subData.parcel = $(subElement)
          .find('.rich-subtable-cell.texto1')
          .text()
          .trim()
        subData.value = $(subElement)
          .find('.rich-subtable-cell.extratoValorPositivoAlinhaDireita')
          .text()
          .slice(2)
          .trim()
        subData.date = formattedDate

        if (
          subData.parcel === 'CREDITO BENEF.' ||
          subData.parcel === 'CREDITO FUNDO'
        ) {
          if (subData.value !== '') {
            let valor
            let valorFormatado

            if (subData.value.includes('C')) {
              valorFormatado = subData.value.replace('C', '').replace(',', '.')
              valor = parseFloat(valorFormatado.replace(/\./g, ''))

              subData.value = valor.toString()
              rowData.parcels.push(subData)
            }
          }
        }
      })

    if (rowData.parcels.length > 0) {
      data.push(rowData)
    }
  })
}
