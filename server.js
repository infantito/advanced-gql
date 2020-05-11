import { ApolloServer } from 'apollo-server'
import gql from 'graphql-tag'

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
  }

  input NewSettingsInput {
    use: ID!
    theme: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingsInput!): Settings!
  }
`

const resolvers = {
  Query: {
    me() {
      return {
        id: Date.now().toString(36),
        username: 'infantito',
        createdAt: Date.now(),
      }
    },
    settings(_, { user }) {
      return {
        user,
        theme: 'Light',
      }
    },
  },
  Mutation: {
    settings(_, { input }) {
      return input
    },
  },
  Settings: {
    user() {
      return {
        id: Date.now().toString(36),
        username: 'infantito',
        createdAt: Date.now(),
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => console.log(`server at ${url} 🚀`))
