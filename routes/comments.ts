import express from 'express'

import Comment from '../model/Comment'
import verifyToken from '../middleware/auth'
import Vote from '../model/Vote'
import { VoteType } from '../types'

const router = express.Router()

router.get('/', async (req, res) => {
  const users = await Comment.find().populate('user')

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

router.post('/', verifyToken, async (req, res, next) => {
  const {
    description, parent, decodedUser,
  } = req.body

  const newComment = new Comment({
    description,
    user: decodedUser.userId,
    parent: parent || null,
    modificationDate: new Date(),
  })

  try {
    const result = await newComment.save()
    res.json(result)
  } catch (error) {
    const { message, name } = error as Error
    if (name === 'ValidationError') {
      res.status(402).json(message)
    }
    next(error)
  }
})

router.post('/:commentId/vote/increase', verifyToken, async (req, res) => {
  const { decodedUser } = req.body
  const { commentId } = req.params
  const vote = await Vote.findOne({
    comment: commentId,
    user: decodedUser.userId,
  })

  if (vote) {
    if (vote.type === VoteType.INCREASE) {
      vote.type = VoteType.NULL
    } else {
      vote.type = VoteType.INCREASE
    }

    const result = await vote.save()
    res.json(result)
  } else {
    const newVote = new Vote({
      comment: commentId,
      user: decodedUser.userId,
      type: VoteType.INCREASE,
    })

    const result = await newVote.save()
    res.json(result)
  }
})

router.post('/:commentId/vote/decrease', verifyToken, async (req, res) => {
  const { decodedUser } = req.body
  const { commentId } = req.params
  const vote = await Vote.findOne({
    comment: commentId,
    user: decodedUser.userId,
  })

  if (vote) {
    if (vote.type === VoteType.DECREASE) {
      vote.type = VoteType.NULL
    } else {
      vote.type = VoteType.DECREASE
    }

    const result = await vote.save()
    res.json(result)
  } else {
    const newVote = new Vote({
      comment: commentId,
      user: decodedUser.userId,
      type: VoteType.DECREASE,
    })

    const result = await newVote.save()
    res.json(result)
  }
})

router.delete('/:commentId', verifyToken, async (req, res) => {
  const { commentId } = req.params
  const comment = await Comment.findByIdAndDelete(commentId)
  if (comment) {
    res.json(String(comment.id))
  } else {
    res.status(404).json('There is no such comment')
  }
})

router.patch('/:commentId', verifyToken, async (req, res) => {
  const { commentId } = req.params
  const { description } = req.body
  const comment = await Comment.findByIdAndUpdate(commentId, {
    description,
    modificationDate: new Date(),
  }, { new: true })
  if (comment) {
    res.json(comment)
  } else {
    res.status(404).json('There is no such comment')
  }
})

export default router
