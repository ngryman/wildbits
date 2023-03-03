import { Hocuspocus } from '@hocuspocus/server'
import { SQLite } from '@hocuspocus/extension-sqlite'

const server = new Hocuspocus({
  port: 1234,
  extensions: [
    new SQLite({
      database: '.local/db.sqlite',
    }),
  ],
})

server.listen()
