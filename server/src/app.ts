import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import routerAgent from './routes/agent.routes'
import routerChat from './routes/chat.routes'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use('/api', routerAgent)
app.use('/api', routerChat)

export default app
