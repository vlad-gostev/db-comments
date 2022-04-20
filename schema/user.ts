import mongoose from 'mongoose'

import { IUser } from '../types'

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

export default userSchema
