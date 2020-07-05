import 'babel-polyfill'
import gql from 'graphql-tag'
import createTestServer from './helper'

const CREATE_POST = gql`
  mutation {
    createPost(input: { message: "👋 🌎!" }) {
      message
    }
  }
`

describe('mutations', () => {
  test('createPost', async () => {
    const { mutate } = createTestServer({
      user: { id: 1 },
      models: {
        Post: {
          createOne() {
            return { message: '👋 🌎!' }
          },
        },
        user: { id: 1 },
      },
    })

    const res = await mutate({ query: CREATE_POST })

    expect(res).toMatchSnapshot()
  })
})
