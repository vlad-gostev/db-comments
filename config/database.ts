/* eslint-disable no-console */
import mongoose, { CallbackError } from 'mongoose'

const { MONGO_URI } = process.env

const connect = function connectDB() {
  if (!MONGO_URI) {
    console.log('Mongo URI is not provided')
    return
  }
  console.log('Mongodb is trying to connect')
  mongoose.connect(MONGO_URI, (error: CallbackError) => {
    if (error) {
      console.log(`Mongodb error: ${error.message}`)
      return setTimeout(connectDB, 5000)
    }
    console.log('Mongodb server runned succesfully')
    return null
  })
}

export default {
  connect,
}
