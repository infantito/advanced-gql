import 'babel-polyfill'
import gql from 'graphql-tag'
import createTestServer from './helper'

const FEED = gql`
  {
    feed {
      id
      message
      createdAt
      likes
      views
    }
  }
`

describe('queries', () => {
  test('feed', async () => {
    const { query } = createTestServer({
      user: { id: 1 },
      models: {
        Post: {
          findMany: jest.fn(() => [
            {
              id: 1,
              message: 'hello',
              createdAt: 12345839,
              likes: 20,
              views: 300,
            },
          ]),
        },
      },
    })

    const res = await query({ query: FEED })
    expect(res).toMatchSnapshot()
  })
})
