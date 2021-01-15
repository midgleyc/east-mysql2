import {Connection} from 'mysql2/promise'

export const tags = []

export const migrate = async (connection: Connection): Promise<void> => {
  try {
    // await connection.query("SQL")
  } finally {
    await connection.end()
  }
}

export const rollback = async (connection: Connection): Promise<void> => {
  try {
    // await connection.query("SQL")
  } finally {
    await connection.end()
  }
}
