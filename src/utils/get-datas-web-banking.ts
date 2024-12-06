import fs from 'node:fs'
import path from 'node:path'
import { load as cheerioLoad } from 'cheerio'
import { Browser, launch, Page } from 'puppeteer'
import { setTimeout } from 'node:timers'

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

async function homePage(page: Page): Promise<void> {
  const buttonSelector = 'button[routerlink="/arrecadacao-federal"]'

  await page.waitForSelector(buttonSelector)
  await page.click(buttonSelector)
}

async function navigateToInitialPage(
  page: Page,
  cityName: string,
): Promise<void> {
  const beneficiarySelector = 'input[formcontrolname="nomeBeneficiarioEntrada"]'
  const beneficiaryFormSubmitSelector = 'button[aria-label="Continuar"]'

  await page.waitForSelector(beneficiarySelector)

  await page.waitForNetworkIdle({
    idleTime: 3000,
  })

  await page.click(beneficiarySelector)
  await page.type(beneficiarySelector, cityName)

  await page.click(beneficiaryFormSubmitSelector)
}

async function formPageWebBanking(page: Page, date: string): Promise<void> {
  await page.waitForNetworkIdle({
    idleTime: 3000,
  })

  const demonstrativeFormSubmitSelector = 'button[aria-label="Continuar"]'

  const $ = cheerioLoad(await page.content())

  const initialInputDateId = $('input[placeholder="DD / MM / AAAA"]')
    .eq(0)
    .attr('id')

  const endDateInputId = $('input[placeholder="DD / MM / AAAA"]')
    .eq(1)
    .attr('id')

  const initialDateInputSelector = `input[id="${initialInputDateId}"]`
  const endDateInputSelector = `input[id="${endDateInputId}"]`

  await page.waitForSelector(initialDateInputSelector)

  await page.waitForSelector(endDateInputSelector)

  await page.click(initialDateInputSelector)
  await page.type(initialDateInputSelector, date)

  await page.click(endDateInputSelector)
  await page.type(endDateInputSelector, date)

  page.click(demonstrativeFormSubmitSelector)
  page.waitForNavigation()
}

async function demonstrativePageWebBanking(page: Page): Promise<void> {
  await page.waitForNetworkIdle({
    idleTime: 3000,
  })
}

async function downloadContentWebBaking(
  page: Page,
  fileType: string,
): Promise<void> {
  const downloadIconSelector = 'button[aria-haspopup="true"]'
  await page.waitForSelector(downloadIconSelector)
  await page.click(downloadIconSelector)

  const menuDownloadSelector = 'ul[class="menu-items"]'
  await page.waitForSelector(menuDownloadSelector, {
    visible: true,
  })

  const textOptionSelector = `a[title=${fileType.toUpperCase()}]`
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

async function deleteFile(pathFile: string, fileName: string): Promise<void> {
  fs.unlink(`${pathFile}/${fileName}`, function (err) {
    if (err) {
      throw err
    }
  })
}

async function parseTransferMunicipal(
  data: string,
  cityId: string,
): Promise<RowData[]> {
  const lines = data.split('\n')
  const currentDate = new Date().toISOString()
  const parsedData: RowData[] = []
  let currentFund: string | null = null
  let currentParcels: SubData[] = []

  lines.forEach((line) => {
    const fundMatch = line.match(/^(\w+)\s+-\s+.+$/)
    if (fundMatch) {
      if (currentFund && currentParcels.length > 0) {
        parsedData.push({
          demonstrative: currentFund,
          parcels: currentParcels,
          cityId,
        })
      }
      currentFund = fundMatch[1]
      currentParcels = []
    }

    const totalInPeriod = line.match('TOTAL DISTRIBUIDO NO PERIODO')

    if (totalInPeriod) {
      if (currentFund && currentParcels.length > 0) {
        parsedData.push({
          demonstrative: currentFund,
          parcels: currentParcels,
          cityId,
        })
      }

      currentFund = 'TOTAL DISTRIBUIDO NO PERIODO'
      currentParcels = []
    }

    const creditMatch = line.match(
      /(CREDITO FUNDO|SIMPLES NACION.|CREDITO BENEF.),\s+([\d.,_]+)C$/,
    )

    if (creditMatch && currentFund) {
      const value = creditMatch[2]
        .replace(/[_,]/g, '')
        .replace('.', '')
        .replace('.', '')

      const formattedValue = `${value.slice(0, value.length - 2)}.${value.slice(
        value.length - 2,
      )}`

      const convertedInCents = parseFloat(formattedValue) * 100

      currentParcels.push({
        parcel: creditMatch[1],
        value: String(convertedInCents),
        date: new Date(currentDate),
      })
    }
  })

  if (currentFund && currentParcels.length > 0) {
    parsedData.push({
      demonstrative: currentFund,
      parcels: currentParcels,
      cityId,
    })
  }

  return parsedData
}

export async function getDatasWebBanking(
  cityId: string,
  cityName: string,
  date: string,
): Promise<void> {
  let browser: Browser | null = null
  let page: Page | null = null

  const fileType = 'txt'

  try {
    const downloadPath = path.join(__dirname, '../tmp/downloads')

    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true })
    }

    browser = await launch({
      headless: true,
      args: [`--disable-extensions`, `--disable-gpu`],
      defaultViewport: null,
      timeout: 4500,
    })

    page = await browser.newPage()

    await page.goto('https://demonstrativos.apps.bb.com.br/', {
      waitUntil: 'networkidle2',
    })

    const client = await page.createCDPSession()
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath,
    })

    await homePage(page)

    await navigateToInitialPage(page, cityName)

    await formPageWebBanking(page, date)

    await demonstrativePageWebBanking(page)

    await downloadContentWebBaking(page, fileType)

    const fileName = `${cityName}_${date}`

    await renameFile(downloadPath, `${fileName}.${fileType}`)

    const data = await readFile(downloadPath, `${fileName}.${fileType}`)

    await deleteFile(downloadPath, `${fileName}.${fileType}`)

    const result = await parseTransferMunicipal(data, cityId)

    const tmpDir = path.join(__dirname, '../tmp')

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir)
    }

    const filePath = path.join(tmpDir, `${fileName}.json`)
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
