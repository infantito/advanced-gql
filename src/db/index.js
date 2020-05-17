import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import createModel from './models'

const adapter = new FileSync('src/db/db.json')
const db = low(adapter)

db.defaults({ posts: [], users: [], settings: [] })

const models = {
  Settings: createModel(db, 'settings'),
  Post: createModel(db, 'posts'),
  User: createModel(db, 'users'),
}

export { db, models }
