import { load } from 'cheerio'
import { launch, Browser, Page } from 'puppeteer'
import console from 'console'
import fs from 'node:fs'
import path from 'path'

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

  console.log(date)

  try {
    browser = await launch({
      headless: 'new', // Navegador invisivel, use 'new' | false
    })
    page = await browser.newPage()

    await page.goto('https://www42.bb.com.br/portalbb/daf/beneficiario.bbx')

    // Seletores para inputs e botoes
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

    // Submetendo o formulario e aguardando a navegacao
    await Promise.all([
      page.click(beneficiarioSubmit),
      page.waitForNavigation(),
    ])

    // Preenchendo os campos de data e fundo
    await page.waitForSelector(startOfDateSelector)
    await page.waitForSelector(endOfDateSelector)
    await page.waitForSelector(dadosDeConsultaSubmit)

    await page.type(startOfDateSelector, date)
    await page.type(endOfDateSelector, date)
    await page.type(fundoSelector, 'TODOS')

    // Submetendo o formulario de consulta
    try {
      await Promise.all([
        page.waitForNavigation(),
        page.click(dadosDeConsultaSubmit),
      ])

      // Verificando se ha uma mensagem de alerta de erro
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

    // Extrair dados da pagina
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

    const tmpDir = path.join(__dirname, '../tmp')
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir)
    }

    // screvendo os dados em um arquivo JSON na pasta tmp
    const fileName = `${cityName}_${date}.json`
    const filePath = path.join(tmpDir, fileName)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    if (browser) {
      await browser.close() // Fechando o navegador
    }
  }
}
