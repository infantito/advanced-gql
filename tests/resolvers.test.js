import resolvers from '../src/resolvers'

describe('resolvers', () => {
  test('feed', () => {
    const result = resolvers.Query.feed(null, null, {
      models: {
        Post: {
          findMany() {
            return ['👋 🌎!']
          },
        },
      },
    })

    expect(result).toEqual(['👋 🌎!'])
  })
})
