import { app } from './app'
import { env } from './env'

// import cron from 'node-cron'
// import { deleteTmpFiles } from './tasks/delete-tmp-files'
// import { scraping } from './tasks/scraping'
// import { processTmpFiles } from './tasks/process-tmp-files'

// cron.schedule('00 8 * * *', () => {
//   console.log('Delete files running!')
//   deleteTmpFiles()
// }) // 7 days

// cron.schedule('48 8 * * *', () => {
//   console.log('Scraping running!')
//   scraping()
// }) // 00:00 all day

// cron.schedule('08 9 * * *', () => {
//   console.log('Process files running!')
//   processTmpFiles()
// }) // 03:00 all day

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
