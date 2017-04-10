import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

moduleFor('route:index', 'Unit | Route | index', {})

/**
 * When accessing the 'index' route, the user should be immediately redirected
 * to the 'chat' route immediately.
 */
test('Accessing the index route', function (assert) {
  // Create Index Route instance.
  const route = this.subject()

  // Stub function to be used to redirect the user.
  sinon.stub(route, 'transitionTo')

  // Invoke function to be tested.
  route.beforeModel()

  // Verify that the user has been redirected.
  assert.strictEqual(route.transitionTo.callCount, 1)

  // Restore stubbed function.
  route.get('transitionTo').restore()
})
