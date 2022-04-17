import mongoose from "mongoose"

import { IComment } from "../types"

const commentSchema = new mongoose.Schema<IComment>({
  author: { type: String, required: true },
  description: { type: String, required: true },
  vote: Number,
  parent: String,
})

export default commentSchema