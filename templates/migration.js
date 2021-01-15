export const tags = []

export const migrate = async (client) => {
  try {
    // await client.db.query("SQL")
  } finally {
    await client.db.end()
  }
}

export const rollback = async (client) => {
  try {
    // await client.db.query("SQL")
  } finally {
    await client.db.end()
  }
}
