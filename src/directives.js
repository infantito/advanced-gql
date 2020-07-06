import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server'
import { defaultFieldResolver, GraphQLString } from 'graphql'
import { formatDate } from './utils'

// https://github.com/APIs-guru/graphql-lodash
class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver
    const { format: defaultFormat } = this.args

    field.args.push({
      name: 'format',
      type: GraphQLString,
    })

    field.resolve = async (root, { format, ...rest }, ctx, info) => {
      const result = await resolver.call(this, root, rest, ctx, info)

      return formatDate(result, format || defaultFormat)
    }

    field.type = GraphQLString
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver

    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user) {
        throw new AuthenticationError('Authentication is required')
      }

      return resolver(root, args, ctx, info)
    }
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver
    const { role } = this.args

    field.resolve = async (root, args, ctx, info) => {
      if (ctx.user.role !== role) {
        throw new AuthenticationError('wrong role')
      }

      return resolver(root, args, ctx, info)
    }
  }
}

export { FormatDateDirective, AuthenticationDirective, AuthorizationDirective }
