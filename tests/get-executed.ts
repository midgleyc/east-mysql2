import tap from 'tap'
import sinon from 'sinon'
import {Adapter, Params} from '../src'
import {makeConnection} from './helpers'

tap.test('no connection created', async t => {
  const adapter = new Adapter({} as Params)
  const executed = await adapter.getExecutedMigrationNames()
  t.same(executed, [])
})

tap.test('default table name', async t => {
  const adapter = new Adapter({} as Params)
  const query = sinon.stub().resolves([[]])
  adapter._connection = makeConnection({
    query: query
  })
  await adapter.getExecutedMigrationNames()
  t.ok(query.calledOnce)
  const call = query.firstCall
  t.equal(call.args[0], 'SELECT name FROM `_migrations`')
})

tap.test('non-default table name', async t => {
  const adapter = new Adapter({mysql: {migrationTable: 'my-migration-table'}} as Params)
  const query = sinon.stub().resolves([[]])
  adapter._connection = makeConnection({
    query: query
  })
  await adapter.getExecutedMigrationNames()
  t.ok(query.calledOnce)
  const call = query.firstCall
  t.equal(call.args[0], 'SELECT name FROM `my-migration-table`')
})

tap.test('no results', async t => {
  const adapter = new Adapter({} as Params)
  const query = sinon.stub().resolves([[]])
  adapter._connection = makeConnection({
    query: query
  })
  const executed = await adapter.getExecutedMigrationNames()
  t.same(executed, [])
})

tap.test('many results', async t => {
  const adapter = new Adapter({} as Params)
  const query = sinon.stub().resolves([[{name: '1-migration_1'}, {name: '2-migration_2'}, {name: '3-some-other-migration'}]])
  adapter._connection = makeConnection({
    query: query
  })
  const executed = await adapter.getExecutedMigrationNames()
  t.same(executed, ['1-migration_1', '2-migration_2', '3-some-other-migration'])
})
