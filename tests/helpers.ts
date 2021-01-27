import {Connection} from 'mysql2/promise'

export function makeConnection(changes?: Partial<Connection>): Connection {
  if (!changes) changes = {}
  const defaults = {
    changeUser: async () => {/* */},
    query: async () => [[]],
    execute: async () => [[]],
  }
  const connection = {...defaults, ...changes}
  return connection as Connection
}
