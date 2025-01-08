import fs from 'node:fs'
import path from 'node:path'
import { load as cheerioLoad } from 'cheerio'
import { Browser, launch, Page } from 'puppeteer'
import { setTimeout } from 'node:timers/promises' // Usar versão de promises do setTimeout
import pLimit from 'p-limit'

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

const limit = pLimit(10) // Limitar a 10 conexões simultâneas

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
  await page.waitForNetworkIdle({ idleTime: 1000 })
  await page.type(beneficiarySelector, cityName)
  await page.click(beneficiaryFormSubmitSelector)
}

async function formPageWebBanking(page: Page, date: string): Promise<void> {
  await page.waitForNetworkIdle({ idleTime: 1000 })
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
  await page.type(initialDateInputSelector, date)
  await page.type(endDateInputSelector, date)
  await Promise.all([
    page.click(demonstrativeFormSubmitSelector),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ])
}

async function demonstrativePageWebBanking(page: Page): Promise<void> {
  await page.waitForNetworkIdle({ idleTime: 1000 })
}

async function downloadContentWebBaking(
  page: Page,
  fileType: string,
): Promise<void> {
  const downloadIconSelector = 'button[aria-haspopup="true"]'
  await page.waitForSelector(downloadIconSelector)
  await page.click(downloadIconSelector)
  const menuDownloadSelector = 'ul[class="menu-items"]'
  await page.waitForSelector(menuDownloadSelector, { visible: true })
  const textOptionSelector = `a[title="${fileType.toUpperCase()}"]`
  await page.waitForSelector(textOptionSelector, { visible: true })
  await page.click(textOptionSelector, { delay: 1000 })
}

async function renameFile(
  pathFile: string,
  oldFileName: string,
  newFileName: string,
): Promise<void> {
  const oldFilePath = path.join(pathFile, oldFileName)
  const newFilePath = path.join(pathFile, newFileName)
  while (!fs.existsSync(oldFilePath)) {
    await setTimeout(1000)
  }
  await fs.promises.rename(oldFilePath, newFilePath)
}

async function readFile(pathFile: string, fileName: string): Promise<string> {
  const filePath = path.join(pathFile, fileName)
  try {
    return await fs.promises.readFile(filePath, 'utf8')
  } catch (err) {
    console.error(err)
    throw new Error('Error on read file.')
  }
}

async function deleteFile(pathFile: string, fileName: string): Promise<void> {
  const filePath = path.join(pathFile, fileName)
  await fs.promises.unlink(filePath)
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
  const downloadPath = path.join(__dirname, '../tmp/downloads')
  const fileName = `${cityName}_${date}.${fileType}`

  try {
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true })
    }

    browser = await launch({
      headless: false,
      args: ['--disable-extensions', '--disable-gpu'],
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
    await renameFile(downloadPath, 'demonstrativoDAF.txt', fileName)

    const data = await readFile(downloadPath, fileName)
    await deleteFile(downloadPath, fileName)

    const result = await parseTransferMunicipal(data, cityId)
    const tmpDir = path.join(__dirname, '../tmp')

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir)
    }

    const filePath = path.join(tmpDir, `${cityName}_${date}.json`)
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
