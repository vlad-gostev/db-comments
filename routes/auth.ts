import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../model/User'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body

    if (!name || !password) {
      return res.status(400).json('All input is required')
    }

    const oldUser = await User.findOne({ name })

    if (oldUser) {
      return res.status(409).json('User Already Exist. Please Login')
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      password: encryptedPassword,
    })

    const token = jwt.sign(
      { user_id: user.id, name },
      process.env.TOKEN_KEY || 'token_secret_key',
      {
        expiresIn: '2h',
      },
    )

    return res.status(201).json({ ...user.toObject(), token })
  } catch (error) {
    const { message } = error as Error
    return res.status(500).json(message)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body

    if (!name && !password) {
      return res.status(400).json('All input is required')
    }
    // Validate if user exist in our database
    const user = await User.findOne({ name })

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user.id, name },
        process.env.TOKEN_KEY || 'token_secret_key',
        {
          expiresIn: '2h',
        },
      )

      return res.status(201).json({ ...user.toObject(), token })
    }
    return res.status(400).json('Invalid Credentials')
  } catch (error) {
    const { message } = error as Error
    return res.status(500).json(message)
  }
})

export default router
