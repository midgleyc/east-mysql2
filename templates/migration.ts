import type {MySQLAdapterDb} from 'east-mysql2'

export const tags = []

export const migrate = async (client: MySQLAdapterDb): Promise<void> => {
  try {
    // await client.db.query("SQL")
  } finally {
    await client.end()
  }
}

export const rollback = async (client: MySQLAdapterDb): Promise<void> => {
  try {
    // await client.db.query("SQL")
  } finally {
    await client.end()
  }
}
