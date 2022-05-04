import mongoose from 'mongoose'

import User from '../model/User'
import Vote from '../model/Vote'
import Comment from '../model/Comment'
import { DecodedUser, VoteType } from '../types'
import Repository from './repository'

type CreateData = {
  description: string
  parent: string
  decodedUser: DecodedUser
}

type DeleteData = {
  commentId: string
}

type UpdateData = {
  modificationDate: string
  description: string
  commentId: string
}

type RateData = {
  commentId: string
  decodedUser: DecodedUser
}

/* eslint-disable no-constructor-return */
class CommentRepository extends Repository {
  private commentPipeline = [
    {
      $lookup: {
        from: User.collection.collectionName,
        localField: Comment.schema.paths.user.path,
        foreignField: User.schema.paths._id.path,
        as: 'user',
      },
    },
    {
      $lookup: {
        from: Vote.collection.collectionName,
        localField: Comment.schema.paths._id.path,
        foreignField: Vote.schema.paths.comment.path,
        as: 'voteIncrease',
        pipeline: [
          {
            $match: {
              type: VoteType.INCREASE,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: Vote.collection.collectionName,
        localField: Comment.schema.paths._id.path,
        foreignField: Vote.schema.paths.comment.path,
        as: 'voteDecrease',
        pipeline: [
          {
            $match: {
              type: VoteType.DECREASE,
            },
          },
        ],
      },
    },
    {
      $project: {
        // __v: 1,
        modificationDate: 1,
        description: 1,
        children: 1,
        parent: 1,
        user: { $arrayElemAt: ['$user', 0] },
        vote: { $subtract: [{ $size: '$voteIncrease' }, { $size: '$voteDecrease' }] },
      },
    },
  ]

  private commentsPipeline = [
    {
      $lookup: {
        from: Comment.collection.collectionName,
        localField: Comment.schema.paths._id.path,
        foreignField: Comment.schema.paths.parent.path,
        as: 'children',
        pipeline: this.commentPipeline,
      },
    },
    ...this.commentPipeline,
  ]

  private getCommentsPipelineWithFilter = (filter: any) => [
    {
      $match: filter,
    },
    ...this.commentsPipeline,
  ]

  getList = async () => {
    const data = await Comment.aggregate(
      this.getCommentsPipelineWithFilter({ parent: null }),
    )
    return data
  }

  create = async ({ description, parent, decodedUser }: CreateData) => {
    const newComment = new Comment({
      description,
      user: decodedUser.userId,
      parent: parent || null,
      modificationDate: new Date(),
    })

    const result = await newComment.save()
    const commentsData = await Comment.aggregate(
      this.getCommentsPipelineWithFilter({ _id: result._id }),
    )

    return commentsData[0]
  }

  delete = async ({ commentId }: DeleteData) => {
    // const session = await mongoose.startSession()

    // try {
    //   let data = null
    //   await session.withTransaction(async () => {
    const data = await Comment.findByIdAndDelete(commentId)

    if (data) {
      await Comment.deleteMany({ parent: commentId })
    }
    // await session.abortTransaction()
    // })

    return data
    // } finally {
    //   session.endSession()
    // }
  }

  update = async ({ commentId, description, modificationDate }: UpdateData) => {
    const comment = await Comment.findById(commentId)

    if (comment) {
      if (comment.modificationDate.toISOString() > modificationDate) {
        throw new Error('It has already beed updated before')
      }

      comment.description = description
      comment.modificationDate = new Date()

      const newComment = await comment.save()

      if (newComment) {
        const commentsData = await Comment.aggregate([
          {
            $match: { _id: newComment._id },
          },
          ...this.commentsPipeline,
        ])
        return commentsData[0]
      }
    }
    return null
  }

  upCommentRate = async ({ decodedUser, commentId }: RateData) => {
    const vote = await Vote.findOne({
      comment: commentId,
      user: decodedUser.userId,
    })

    let voteData = null

    if (vote) {
      if (vote.type === VoteType.INCREASE) {
        vote.type = VoteType.NULL
      } else {
        vote.type = VoteType.INCREASE
      }

      voteData = await vote.save()
    } else {
      const newVote = new Vote({
        comment: commentId,
        user: decodedUser.userId,
        type: VoteType.INCREASE,
      })

      voteData = await newVote.save()
    }

    const commentsData = await Comment.aggregate(
      this.getCommentsPipelineWithFilter({ _id: voteData.comment }),
    )
    return commentsData[0]
  }

  downCommentRate = async ({ decodedUser, commentId }: RateData) => {
    const vote = await Vote.findOne({
      comment: commentId,
      user: decodedUser.userId,
    })

    let voteData = null

    if (vote) {
      if (vote.type === VoteType.DECREASE) {
        vote.type = VoteType.NULL
      } else {
        vote.type = VoteType.DECREASE
      }

      voteData = await vote.save()
    } else {
      const newVote = new Vote({
        comment: commentId,
        user: decodedUser.userId,
        type: VoteType.DECREASE,
      })

      voteData = await newVote.save()
    }

    const commentsData = await Comment.aggregate(
      this.getCommentsPipelineWithFilter({ _id: voteData.comment }),
    )
    return commentsData[0]
  }
}

export default CommentRepository
