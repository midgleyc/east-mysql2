import tap from 'tap'
import sinon from 'sinon'
import {Adapter, Params} from '../src'
import {makeConnection} from './helpers'

tap.test('disconnects', async t => {
  const adapter = new Adapter({} as Params)
  const end = sinon.stub().resolves()
  adapter._connection = makeConnection({
    end: end
  })
  await adapter.disconnect()
  t.ok(end.calledOnce)
})

tap.test('with no connection, does not error', async t => {
  const adapter = new Adapter({} as Params)
  await t.resolves(async () => await adapter.disconnect())
})
