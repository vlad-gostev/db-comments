import { Schema } from 'mongoose'

import { IComment } from '../types'

const commentSchema = new Schema<IComment>({
  description: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Comment' },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  modificationDate: { type: Date, required: true },
})

export default commentSchema
