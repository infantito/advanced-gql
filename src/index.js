import { ApolloServer } from 'apollo-server'

import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
} from './directives'
import { createToken, getUserFromToken } from './auth'
import * as db from './db'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatDate: FormatDateDirective,
    dateFormat: FormatDateDirective,
    authenticated: AuthenticationDirective,
    authorized: AuthorizationDirective,
  },
  context({ req, connection }) {
    const context = { ...db }

    if (connection) {
      return { ...context, ...connection.context }
    }

    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return { ...context, user, createToken }
  },
  formatError(error) {
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      source: {
        code: error.originalError?.code,
        state: error.originalError?.state,
      },
    }
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
