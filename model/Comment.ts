import mongoose from 'mongoose'
import commentSchema from '../schema/comment'

const Comment = mongoose.model('Comment', commentSchema)

export default Comment