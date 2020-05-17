import { ApolloServer } from 'apollo-server'

import typeDefs from './typeDefs'
import resolvers from './resolvers'
import { createToken, getUserFromToken } from './auth'
import * as db from './db'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req, connection }) {
    const context = { ...db }

    if (connection) {
      return { ...context, ...connection.context }
    }

    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return { ...context, user, createToken }
  },
  subscriptions: {
    onConnect(params) {
      const token = params.authorization
      const user = getUserFromToken(token)

      return { user }
    },
  },
})

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
