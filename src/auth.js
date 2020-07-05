import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'
import { models } from './db'

const secret = 'catpack'

/**
 * takes a user object and creates  jwt out of it
 * using user.id and user.role
 * @param {Object} user the user to create a jwt for
 */
export const createToken = ({ id, role }) => jwt.sign({ id, role }, secret)

/**
 * will attempt to verify a jwt and find a user in the
 * db associated with it. Catches any error and returns
 * a null user
 * @param {String} token jwt from client
 */
export const getUserFromToken = token => {
  try {
    const user = jwt.verify(token, secret)
    return models.User.findOne({ id: user.id })
  } catch {
    return null
  }
}

/**
 * checks if the user is on the context object
 * continues to the next resolver if true
 * @param {Function} next next resolver function to run
 */
export const authenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError('not authorized')
  }

  return next(root, args, context, info)
}

/**
 * checks if the user on the context has the specified role.
 * continues to the next resolver if true
 * @param {String} role enum role to check for
 * @param {Function} next next resolver function to run
 */
export const authorized = (role, next) => (root, args, context, info) => {
  if (context.user.role !== role) {
    throw new AuthenticationError(`Must be a ${role}`)
  }

  return next(root, args, context, info)
}
