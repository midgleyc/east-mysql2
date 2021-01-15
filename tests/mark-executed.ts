import tap from 'tap'
import sinon from 'sinon'
import {Adapter, Params} from '../src'
import {makeConnection} from './helpers'

tap.test('default table name', async t => {
  const adapter = new Adapter({} as Params)
  const execute = sinon.stub().resolves()
  adapter._connection = makeConnection({
    execute: execute
  })
  await adapter.markExecuted('1-migration_1')
  t.assert(execute.calledOnce)
  const call = execute.firstCall
  t.equal(call.args[0], 'INSERT INTO `_migrations` VALUES (?)')
  t.deepEqual(call.args[1], ['1-migration_1'])
})

tap.test('non-default table name', async t => {
  const adapter = new Adapter({mysql: {migrationTable: 'my-migration-table'}} as Params)
  const execute = sinon.stub().resolves()
  adapter._connection = makeConnection({
    execute: execute
  })
  await adapter.markExecuted('2-migration_2')
  t.assert(execute.calledOnce)
  const call = execute.firstCall
  t.equal(call.args[0], 'INSERT INTO `my-migration-table` VALUES (?)')
  t.deepEqual(call.args[1], ['2-migration_2'])
})

tap.test('with no connection, errors', async t => {
  const adapter = new Adapter({} as Params)
  return t.rejects(async () => await adapter.markExecuted('test'))
})
