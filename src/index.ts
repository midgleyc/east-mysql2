import path from 'path'
import SqlString from 'sqlstring'
import type {Adapter as AdapterInterface, AdapterConstructor, AdapterConstructorParams} from 'east'
import {Connection, createConnection} from 'mysql2/promise'

export interface MySQLParams {
  host?: string
  port?: number
  user?: string
  password?: string
  migrationDatabase?: string
  migrationTable?: string
  createDbOnConnect?: boolean
}

export interface Params extends AdapterConstructorParams<MySQLClient> {
  mysql?: MySQLParams
}

export interface MySQLClient {
  db: Connection
}

export class Adapter implements AdapterInterface<MySQLClient> {
  _connection?: Connection
  _mysqlParams: MySQLParams

  constructor(params: Params) {
    params = params || {}
    this._mysqlParams = {}
    this._mysqlParams.host = params.mysql?.host ?? process.env.MYSQL_HOST
    this._mysqlParams.port = params.mysql?.port ?? this.toNumber(process.env.MYSQL_PORT)
    this._mysqlParams.user = params.mysql?.user ?? process.env.MYSQL_USER
    this._mysqlParams.password = params.mysql?.password ?? process.env.MYSQL_PASSWORD
    this._mysqlParams.migrationDatabase = params.mysql?.migrationDatabase ?? '_migrations'
    this._mysqlParams.migrationTable = params.mysql?.migrationTable ?? '_migrations'
    this._mysqlParams.createDbOnConnect = params.mysql?.createDbOnConnect ?? true
  }

  async connect(): Promise<MySQLClient> {
    this._connection = await createConnection({
      host: this._mysqlParams.host,
      port: this._mysqlParams.port,
      user: this._mysqlParams.user,
      password: this._mysqlParams.password
    })

    if (this._mysqlParams.createDbOnConnect) {
      // maybe user doesn't have create DB permissions: as this is default, check first
      const [results] = await this._connection.execute('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?', [this._mysqlParams.migrationDatabase])
      if ((results as Array<{SCHEMA_NAME: string}>).length == 0) {
        // create the database
        await this._connection.query(`CREATE DATABASE ${SqlString.escapeId(this._mysqlParams.migrationDatabase)}`)
      }
    }
    await this.changeToMigrationDatabase()
    await this._connection.query('CREATE TABLE IF NOT EXISTS ' + SqlString.escapeId(this._mysqlParams.migrationTable) + ' (`name` VARCHAR(255) NOT NULL, PRIMARY KEY (`name`))')

    return {db: this._connection}
  }

  async disconnect(): Promise<void> {
    await this._connection?.end()
  }

  getTemplatePath(sourceMigrationExtension: string): string {
    if (['js', 'ts'].includes(sourceMigrationExtension)) {
      return path.resolve(__dirname, `../templates/migration.${sourceMigrationExtension}`)
    }
    throw new Error(`Adapter doesn't provide template ".${sourceMigrationExtension}" source files, please specify template in configuration`)
  }

  async getExecutedMigrationNames(): Promise<string[]> {
    if (this._connection == null) return []
    await this.changeToMigrationDatabase()
    const [results] = await this._connection.query(`SELECT name FROM ${SqlString.escapeId(this._mysqlParams.migrationTable)}`)
    return (results as Array<{name: string}>).map(r => r.name)
  }

  async markExecuted(migrationName: string): Promise<void> {
    if (this._connection == null) {
      throw new Error(`No connection; ensure connect is run before calling this method`)
    }
    await this.changeToMigrationDatabase()
    await this._connection.execute(`INSERT INTO ${SqlString.escapeId(this._mysqlParams.migrationTable)} VALUES (?)`, [migrationName])
  }

  async unmarkExecuted(migrationName: string): Promise<void> {
    if (this._connection == null) {
      throw new Error(`No connection; ensure connect is run before calling this method`)
    }
    await this.changeToMigrationDatabase()
    await this._connection.execute(`DELETE FROM ${SqlString.escapeId(this._mysqlParams.migrationTable)} WHERE name = ?`, [migrationName])
  }

  private async changeToMigrationDatabase(): Promise<void> {
    await this._connection!.changeUser({database: this._mysqlParams.migrationDatabase})
  }

  private toNumber(port?: string): number | undefined {
    if (port == null) return undefined
    return parseInt(port)
  }
}
const _: AdapterConstructor<MySQLClient> = Adapter

export default Adapter
