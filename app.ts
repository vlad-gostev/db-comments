import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose, { CallbackError } from 'mongoose'

import indexRouter from './routes/index'
import commentsRouter from './routes/comments'

let DBConnectionError = false

const connectDB = () => {
  console.log('Mongodb is trying to connect')
  mongoose.connect('mongodb://localhost:27017/sigma', (error: CallbackError) => {
    if (error) {
      console.log(`Mongodb error: ${error.message}`)
      DBConnectionError = true
      return setTimeout(connectDB, 5000)
    }
    DBConnectionError = false
    console.log('Mongodb server runned succesfully')
  })
}

connectDB()

const initApp = express()

initApp.use(logger('dev'))
initApp.use(express.json())
initApp.use(express.urlencoded({ extended: false }))
initApp.use(cookieParser())
initApp.use(express.static(path.join(__dirname, 'public')))

initApp.use('/', indexRouter)
initApp.use('/comments', commentsRouter)

export default initApp
