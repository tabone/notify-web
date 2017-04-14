import Ember from 'ember'
import { moduleFor, test } from 'ember-qunit'

moduleFor('adapter:application', 'Unit | Adapter | application', {
  beforeEach: function beforeEach () {
    /**
     * Stubbing the Config Service.
     * @type {service}
     */
    const configStub = Ember.Service.extend({
      api: {
        url: 'http://hikupz.io/api'
      }
    })

    this.register('service:config', configStub)
    this.inject.service('config')
  }
})

/**
 * When initializing the JSON-API Adapter, its host should be the same as the
 * host provided by the Config Service.
 */
test('When initialized it should set the host from the config service', function (assert) {
  assert.expect(1)
  const adapter = this.subject()
  assert.strictEqual(adapter.get('host'), adapter.get('config.api.url'))
})
