import { moduleFor, test } from 'ember-qunit'

/**
 * Stubbing the Config Service.
 * @type {service}
 */
const configStub = Ember.Service.extend({
  api: {
    url: 'http://hikupz.io/api'
  }
})

moduleFor('adapter:application', 'Unit | Adapter | application', {
  beforeEach: function beforeEach () {
    this.register('service:config', configStub)
    this.inject.service('config')
  }
})

// Replace this with your real tests.
test('When initialized it should set the host from the config service', function (assert) {
  assert.expect(1)
  const adapter = this.subject()
  assert.strictEqual(adapter.get('host'), adapter.get('config.api.url'))
})
