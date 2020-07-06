const { ApolloServer } = require('apollo-server')

const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const {
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
} = require('./directives')
const { createToken, getUserFromToken } = require('./auth')
const db = require('./db')

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
    const { message, locations, path, originalError } = error

    const source = {
      code: (originalError || {}).code,
      state: (originalError || {}).state,
    }

    return {
      message,
      locations,
      path,
      source,
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
