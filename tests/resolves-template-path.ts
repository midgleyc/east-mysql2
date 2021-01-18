import path from 'path'
import tap from 'tap'
import {Adapter, Params} from '../src/index'

tap.test('resolves provided template if valid extension', async t => {
  const adapter = new Adapter({} as Params)
  t.equal(adapter.getTemplatePath('js'), path.resolve(__dirname, '../templates/migration.js'))
  t.equal(adapter.getTemplatePath('ts'), path.resolve(__dirname, '../templates/migration.ts'))
})

tap.test('throws error if invalid extension provided', async t => {
  const adapter = new Adapter({} as Params)
  t.throws(() => adapter.getTemplatePath('.mjs'))
})
