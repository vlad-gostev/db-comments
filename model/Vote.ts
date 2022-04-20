import mongoose from 'mongoose'

import voteSchema from '../schema/vote'

const Vote = mongoose.model('Vote', voteSchema)

export default Vote
