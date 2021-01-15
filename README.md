# east mysql2

MySQL adapter for [east](https://github.com/okv/east) which uses the [node-mysql2](https://github.com/sidorares/node-mysql2) driver.

All executed migrations names will by default be stored in a `_migrations` collection in the `_migrations` database.

`client` passed to `migrate` and `rollback` functions is a `Connection` object as returned by `node-mysql2`'s `createConnection`.

## Configuration

Provide login configuration using environment variables:
`MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`

or in `.eastrc`:
```json
{
    "mysql": {
        "host": "<host>",
        "port": "<port>"
        "user": "<user>",
        "password": "<password>",
    }
}
```

`host` defaults to `localhost`. `port` defaults to 3306.

You can also configure the database and table migration information is stored in.
```json
{
    "mysql": {
        "migrationDatabase": "<database>"
        "migrationTable": "<table>"
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
