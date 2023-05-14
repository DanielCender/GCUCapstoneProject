import { Client } from 'pg'
import { APP_CONFIG } from '../config'

const environment = APP_CONFIG()

const db = new Client({
  connectionString: environment.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

db.connect()
  .then(() => console.log('connected'))
  .catch((err: Error) => console.error('connection error', err.stack))

export { db }
