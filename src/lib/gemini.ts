import { env } from '@/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(env.GEMINI_KEY_API)
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export const promptModel = (data: string, cityId: string) => {
  return `
    Process the following data and return the installment names and their credited amounts, already converted to cents:

    Data:
    ${data}

    Instructions:
    1. Identify each installment name located next to a date.
    2. Extract the final credited amount for each installment and convert it to cents.
    3. Additionally, extract the "TOTAL DISTRIBUIDO NO PERIODO" entry, including the name and credited amount.
    4. Format the results exactly as the only JSON structure below, using only the current date and the provided "cityId" value:
    5. Return only JSON Format for insert in file JSON.
    [
      {
        "parcel": "[full name of installment]",
        "value": [amount in cents],
        "date": "[current date in YYYY-MM-DD format]",
        "cityId": "${cityId}"
      }
    ]
  `
}
