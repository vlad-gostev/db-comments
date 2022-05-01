import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import ClientDB from './config/database'
import indexRouter from './routes/index'
import commentsRouter from './routes/comment'
import authRouter from './routes/auth'

ClientDB.connect()

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)

// const jsonErrorHandler: ErrorRequestHandler = (err, req, res) => {
//   res.status(500).json({ error: err })
// }

// app.use(jsonErrorHandler)

export default app
