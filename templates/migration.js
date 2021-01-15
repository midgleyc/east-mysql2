export const tags = []

export const migrate = async (connection) => {
  try {
    // await connection.query("SQL")
  } finally {
    await connection.end()
  }
}

export const rollback = async (connection) => {
  try {
    // await connection.query("SQL")
  } finally {
    await connection.end()
  }
}
