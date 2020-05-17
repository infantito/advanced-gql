import { ApolloServer } from 'apollo-server'

import typeDefs from './typeDefs'
import resolvers from './resolvers'
import { createToken, getUserFromToken } from './auth'
import * as db from './db'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }) {
    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return { ...db, user, createToken }
  },
})

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
