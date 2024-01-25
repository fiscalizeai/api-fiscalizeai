import { load } from 'cheerio'
import { launch, Browser, Page } from 'puppeteer'
import console from 'console'
import fs from 'node:fs'
import path from 'path'

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

export async function getDatasWebBanking(
  cityId: string,
  cityName: string,
  date: string,
) {
  let browser: Browser | null = null
  let page: Page | null = null

  try {
    browser = await launch({
      headless: 'new',
    })
    page = await browser.newPage()

    await page.goto('https://www42.bb.com.br/portalbb/daf/beneficiario.bbx')

    // Inputs e Buttons
    const beneficiarioSelector = '#formulario\\:txtBenef'
    const beneficiarioSubmit =
      '#formulario > div:nth-child(4) > div > input:nth-child(1)'
    const startOfDateSelector = '#formulario\\:dataInicial'
    const endOfDateSelector = '#formulario\\:dataFinal'
    const dadosDeConsultaSubmit =
      '#formulario > div:nth-child(7) > div > input:nth-child(1)'
    const fundoSelector = '#formulario\\:comboFundo'

    // Home
    await page.click(beneficiarioSelector)
    await page.type(beneficiarioSelector, cityName)

    await Promise.all([
      page.click(beneficiarioSubmit),
      page.waitForNavigation(),
    ])

    // Dados de consulta
    await page.waitForSelector(startOfDateSelector)
    await page.waitForSelector(endOfDateSelector)
    await page.waitForSelector(dadosDeConsultaSubmit)

    await page.type(startOfDateSelector, date)
    await page.type(endOfDateSelector, date)
    await page.type(fundoSelector, 'TODOS')

    try {
      await Promise.all([
        page.waitForNavigation(),
        page.click(dadosDeConsultaSubmit),
      ])

      const alertMessage = await page.waitForSelector('.alert.alert-danger', {
        visible: true,
        timeout: 3000,
      })

      if (alertMessage) {
        return null
      }
    } catch (err) {
      console.error(err)
    }

    // Extrair dados
    await page.waitForSelector('#formulario\\:demonstrativoList\\:tb')

    const pageData = await page.evaluate(() => {
      return {
        html: document.documentElement.innerHTML,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      }
    })

    const $ = load(pageData.html)
    const data: RowData[] = []

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
            date: new Date(),
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
          subData.date = new Date()

          if (
            subData.parcel === 'CREDITO BENEF.' ||
            subData.parcel === 'CREDITO FUNDO'
          ) {
            if (subData.value !== '') {
              let valor
              let valorFormatado

              if (subData.value.includes('C')) {
                valorFormatado = subData.value
                  .replace('C', '')
                  .replace(',', '.')
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

    const tmpDir = path.join(__dirname, '../../tmp')
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir)
    }

    // Exibindo os resultados
    const fileName = `${cityName}_${date}.json`
    const filePath = path.join(tmpDir, fileName)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
