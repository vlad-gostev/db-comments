import express from 'express'

import verifyToken from '../middleware/auth'
import CommentRepository from '../repository/comment.repository'

const repository = new CommentRepository()

const router = express.Router()

router.get('/', async (req, res) => {
  const comments = await repository.getList()

  res.json(comments)
})

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { description, parent, decodedUser } = req.body

    const newComment = await repository.create({ description, parent, decodedUser })
    res.json(newComment)
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

  const updatedComment = await repository.upCommentRate({ decodedUser, commentId })

  res.json(updatedComment)
})

router.post('/:commentId/vote/decrease', verifyToken, async (req, res) => {
  const { decodedUser } = req.body
  const { commentId } = req.params

  const updatedComment = await repository.downCommentRate({ decodedUser, commentId })

  res.json(updatedComment)
})

router.delete('/:commentId', verifyToken, async (req, res) => {
  const { commentId } = req.params

  const deletedComment = await repository.delete({ commentId })

  if (deletedComment) {
    res.json(commentId)
  } else {
    res.status(404).json('There is no such comment')
  }
})

router.patch('/:commentId', verifyToken, async (req, res) => {
  const { commentId } = req.params
  const { description, modificationDate } = req.body

  const updatedComment = await repository.update({ commentId, description, modificationDate })
  if (updatedComment) {
    res.json(updatedComment)
  } else {
    res.status(404).json('There is no such comment')
  }
})

export default router
