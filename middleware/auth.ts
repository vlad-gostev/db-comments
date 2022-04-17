import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const { TOKEN_KEY } = process.env

const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) {
    return res.status(403).json('A token is required for authentication')
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY || '')
    req.body.decodedUser = decoded
  } catch (err) {
    return res.status(401).json('Invalid Token')
  }
  return next()
}

export default verifyToken
