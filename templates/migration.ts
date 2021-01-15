import type {MySQLAdapterDb} from 'east-mysql2'

export const tags = []

export const migrate = async (client: MySQLAdapterDb): Promise<void> => {
  // await client.db.query("SQL")
}

export const rollback = async (client: MySQLAdapterDb): Promise<void> => {
  // await client.db.query("SQL")
}
