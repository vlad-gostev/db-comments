import { Schema } from 'mongoose'

import { IVote } from '../types'

const voteSchema = new Schema<IVote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
    unique: true,
  },
  type: { type: String, required: true },
})

export default voteSchema
