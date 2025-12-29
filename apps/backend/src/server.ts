import app from './app'
import { env } from './config/env'
import { connectMongo } from './db/mongo'

async function start() {
  await connectMongo()

  app.listen(env.PORT, () => {
    console.log(`Backend running on port ${env.PORT}`)
  })
}

start()
