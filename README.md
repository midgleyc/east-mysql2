# east mysql2

MySQL adapter for [east](https://github.com/okv/east) which uses the Promisified [mysql2](https://github.com/sidorares/node-mysql2) driver.

Requires Node 16+ for v2, Node 10+ for v1.

All executed migrations names will by default be stored in a `_migrations` collection in the `_migrations` database.

`client` passed to `migrate` and `rollback` functions is an object containing "db" which is a `Connection` object as returned by `mysql2/promise`'s `createConnection`.

Use as `await client.db.query("SQL")`.

## Configuration

Provide login configuration using environment variables:
`MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`

or in `.eastrc`:
```jsonc
{
    "mysql": {
        "host": "remote_host",
        "port": 3307, // note the lack of quotes!
        "user": "custom_user",
        "password": "my_password",
    }
}
```

`host` defaults to `localhost`. `port` defaults to 3306. Note that `port` is specified as a number, not a string.

You can also configure the database and table migration information is stored in.
```json
{
    "mysql": {
        "migrationDatabase": "__migrations",
        "migrationTable": "migration_table"
    }
}
```

`migrationDatabase` defaults to `_migrations`. `migrationTable` also defaults to `_migrations`.

`migrationDatabase` is created by default if it does not exist. If you do not want this behaviour, add in `.eastrc`

```json
{
    "mysql": {
        "createDbOnConnect": false
    }
}
