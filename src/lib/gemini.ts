import { env } from '@/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(env.GEMINI_KEY_API)
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export const promptModel = (data: string) => {
  return `
    Process the information provided below and return the name of the instalmment and the final amount credited, already converted to cents:
    
    ${data}

    Instructions:
    Step 1. Identify the name of the parcels next to the date
    Step 2. Find the final amount credited and covert it to cents.
    Step 3. Also extract the total value that is in "TOTAL DISTRIBUTED IN THE PERIOD", extract this name and the amount credited
    Step 4. Return results in the following format json:
      Parcel: [Full name of parcel]
      Value: [Value in cents]
      Date: [Current Date]
  `
}
