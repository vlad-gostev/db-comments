import express from 'express'

import Comment from '../model/Comment'

const router = express.Router()

/* GET users listing. */
router.get('/', async (req, res) => {
  const users = await Comment.find()

  const usersIds = users.map((item) => item.id)
  const children = await Comment.find({ parent: { $in: usersIds } })
  const usersWithChildren = users.map((item) => ({
    ...item.toObject(),
    children: children
      .filter((child) => child.parent?.toString() === item.id)
      .map((child) => child.toObject()),
  }))
  res.json(usersWithChildren)
})

router.post('/', async (req, res) => {
  const { description, userId, parent } = req.body
  const newComment = new Comment({ description, userId, parent: parent || null })

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

router.patch('/:commentId/vote/increase', async (req, res) => {
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

router.patch('/:commentId/vote/decrease', async (req, res) => {
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

router.delete('/:commentId', async (req, res) => {
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

router.patch('/:commentId', async (req, res) => {
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
