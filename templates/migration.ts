import type {MySQLClient} from 'east-mysql2'

export const tags: string[] = []

export const migrate = async (client: MySQLClient): Promise<void> => {
  // await client.db.query("SQL")
}

export const rollback = async (client: MySQLClient): Promise<void> => {
  // await client.db.query("SQL")
}
