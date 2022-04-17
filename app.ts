import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import ClientDB from './config/database'
import indexRouter from './routes/index'
import commentsRouter from './routes/comments'
import authRouter from './routes/auth'
import verifyToken from './middleware/auth'

ClientDB.connect()

const initApp = express()

initApp.use(logger('dev'))
initApp.use(express.json())
initApp.use(express.urlencoded({ extended: false }))
initApp.use(cookieParser())
initApp.use(express.static(path.join(__dirname, 'public')))

initApp.use('/', indexRouter)
initApp.use('/auth', authRouter)
initApp.use('/comments', verifyToken, commentsRouter)

export default initApp
