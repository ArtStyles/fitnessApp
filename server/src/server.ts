import app from './app'
import { env } from './config/env'

const start = async () => {
  const server = app.listen(env.PORT, () => {
    console.log(`FitForge API running on port ${env.PORT} [${env.NODE_ENV}]`)
  })

  const shutdown = async () => {
    console.log('Shutting down...')
    server.close(() => {
      process.exit(0)
    })
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

start().catch(err => {
  console.error('Fatal error during startup:', err)
  process.exit(1)
})
