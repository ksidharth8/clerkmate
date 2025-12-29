import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health'
import authRouter from './routes/auth'
import standupRouter from './routes/standups'
import summaryRouter from './routes/summaries'
import googleAuthRouter from './routes/auth.google'
import { env } from './config/env'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL }))
app.use(express.json())

app.use('/health', healthRouter)
app.use('/auth', authRouter)
app.use('/auth', googleAuthRouter)
app.use('/standups', standupRouter)
app.use('/summaries', summaryRouter)

export default app
