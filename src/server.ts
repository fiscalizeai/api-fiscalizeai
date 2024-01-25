import { app } from './app'
import { env } from './env'

import cron from 'node-cron'
import { deleteTmpFiles } from './tasks/delete-tmp-files'
import { scraping } from './tasks/scraping'
import { processFilesTmp } from './tasks/process-files-tmp'

cron.schedule('00 9 * * *', () => {
  deleteTmpFiles()
}) // 7 days

cron.schedule('50 8 * * *', () => {
  scraping()
}) // 00:00 all day

cron.schedule('55 8 * * *', () => {
  processFilesTmp()
}) // 03:00 all day

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
