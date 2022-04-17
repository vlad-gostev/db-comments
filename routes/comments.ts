import express, { Request } from 'express'

import Comment from '../model/Comment'
import { IComment } from '../types'

const router = express.Router()

/* GET users listing. */
router.get('/', async (req: Request<null, IComment[], null>, res) => {
  const users = await Comment.find()
  res.json(users)
})

router.post('/', async (req: Request<null, IComment | Error['message'], IComment>, res) => {
  const { author, description, parent } = req.body
  const newComment = new Comment({ author, description, parent: parent || null })

  try {
    const result = await newComment.save()
    res.json(result)
  } catch (error) {
    const { message, name } = error as Error
    if (name === 'ValidationError') {
      res.status(402).json(message)
      return
    }
    res.status(500).json(message)
  }
})

router.patch('/:commentId/vote/increase', async (req: Request<{ commentId: string }, IComment | Error['message'], null>, res) => {
  try {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId)
    if (comment) {
      comment.vote = (comment.vote || 0) + 1
      await comment.save()
      res.json(comment)
    } else {
      res.status(404).json('There is no such comment')
    }
  } catch (error) {
    const { message } = error as Error
    res.status(500).json(message)
  }
})

router.patch('/:commentId/vote/decrease', async (req: Request<{ commentId: string }, IComment | Error['message'], null>, res) => {
  try {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId)
    if (comment) {
      comment.vote = (comment.vote || 0) - 1
      await comment.save()
      res.json(comment)
    } else {
      res.status(404).json('There is no such comment')
    }
  } catch (error) {
    const { message } = error as Error
    res.status(500).json(message)
  }
})

router.delete('/:commentId', async (req: Request<{ commentId: string }, string | Error['message'], null>, res) => {
  try {
    const { commentId } = req.params
    const comment = await Comment.findByIdAndDelete(commentId)
    if (comment) {
      res.json(String(comment.id))
    } else {
      res.status(404).json('There is no such comment')
    }
  } catch (error) {
    const { message } = error as Error
    res.status(500).json(message)
  }
})

router.patch('/:commentId', async (req: Request<{ commentId: string }, IComment | Error['message'], IComment>, res) => {
  try {
    const { commentId } = req.params
    const { description } = req.body
    const comment = await Comment.findByIdAndUpdate(commentId, { description }, { new: true })
    if (comment) {
      res.json(comment)
    } else {
      res.status(404).json('There is no such comment')
    }
  } catch (error) {
    const { message } = error as Error
    res.status(500).json(message)
  }
})

export default router
