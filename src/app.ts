
import express, {Application, Request, NextFunction} from 'express'
import { Error500Response } from './types'
import ip from './routes/ip'

const app: Application = express()

app.use(express.json())

app.use('/ip', ip)

app.use((err: Error, req: Request, res: Error500Response, next: NextFunction) => {
    return res.status(500).json({
        message: err.message
    })
})

export default app
