import tap from 'tap'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import {Params} from '../src'
import {makeConnection} from './helpers'
import mysql from 'mysql2/promise'

const mysqlStub: Partial<typeof mysql> = {}

const Adapter = proxyquire('../src', {'mysql2/promise': mysqlStub}).Adapter

tap.test('default to undefined if nothing set', async t => {
  const createConnection = sinon.stub().resolves(makeConnection())
  mysqlStub.createConnection = createConnection
  const adapter = new Adapter(null as unknown as Params)
  await adapter.connect()
  t.assert(createConnection.calledOnce)
  const call = createConnection.firstCall
  t.deepEqual(call.args[0], {host: undefined, port: undefined, user: undefined, password: undefined})
})

tap.test('use JSON configuration if present', async t => {
  const reset = setEnv({MYSQL_PASSWORD: 'some_pass'})
  const createConnection = sinon.stub().resolves(makeConnection())
  mysqlStub.createConnection = createConnection
  const adapter = new Adapter({mysql: {host: 'myhost', port: 1000, user: 'mrs bloggs', password: ''}} as Params)
  await adapter.connect()
  t.assert(createConnection.calledOnce)
  const call = createConnection.firstCall
  t.deepEqual(call.args[0], {host: 'myhost', port: 1000, user: 'mrs bloggs', password: ''})
  reset()
})

tap.test('use ENV configuration if JSON not present', async t => {
  const reset = setEnv({MYSQL_HOST: 'some_host', MYSQL_PORT: '1337', MYSQL_USER: 'my_user', MYSQL_PASSWORD: 'a_password'})
  const createConnection = sinon.stub().resolves(makeConnection())
  mysqlStub.createConnection = createConnection
  const adapter = new Adapter({} as Params)
  await adapter.connect()
  t.assert(createConnection.calledOnce)
  const call = createConnection.firstCall
  t.deepEqual(call.args[0], {host: 'some_host', port: 1337, user: 'my_user', password: 'a_password'})
  reset()
})

tap.test('create migration database by default', async t => {
  const query = sinon.stub().resolves()
  mysqlStub.createConnection = sinon.stub().resolves(makeConnection({query}))
  const adapter = new Adapter({} as Params)
  await adapter.connect()
  t.assert(query.firstCall.calledWith('CREATE DATABASE `_migrations`'))
})

tap.test('create configured migration database if present', async t => {
  const query = sinon.stub().resolves()
  mysqlStub.createConnection = sinon.stub().resolves(makeConnection({query}))
  const adapter = new Adapter({mysql:{migrationDatabase: 'migration`-database'}} as Params)
  await adapter.connect()
  t.assert(query.firstCall.calledWith('CREATE DATABASE `migration``-database`'))
})

tap.test('does not create migration database if so configured', async t => {
  const query = sinon.stub().resolves()
  mysqlStub.createConnection = sinon.stub().resolves(makeConnection({query}))
  const adapter = new Adapter({mysql:{createDbOnConnect: false, migrationTable: 'main'}} as Params)
  await adapter.connect()
  t.assert(query.firstCall.calledWith('CREATE TABLE IF NOT EXISTS `main` (`name` VARCHAR(255) NOT NULL, PRIMARY KEY (`name`))'))
})

tap.test('does not try to create migration database if it exists', async t => {
  const execute = sinon.stub().resolves([['_migrations']])
  const query = sinon.stub().resolves()
  mysqlStub.createConnection = sinon.stub().resolves(makeConnection({query, execute}))
  const adapter = new Adapter({} as Params)
  await adapter.connect()
  t.assert(query.calledOnce)
  const callArg = query.firstCall.args
  t.notMatch(callArg[0], /^CREATE DATABASE/)
})

function setEnv(keys: {[key: string]: string | undefined}): () => void {
  const originals: typeof keys = {}
  for (const [key, value] of Object.entries(keys)) {
    originals[key] = process.env[key]
    if (value == null) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
  return () => {setEnv(originals)}
}
