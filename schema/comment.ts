import { Schema } from 'mongoose'

import { IComment } from '../types'

const commentSchema = new Schema<IComment>({
  description: { type: String, required: true },
  vote: { type: Number, default: 0 },
  parent: { type: Schema.Types.ObjectId, ref: 'Comment' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export default commentSchema
