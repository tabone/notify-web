import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

moduleFor('route:index', 'Unit | Route | index', {})

/**
 * When accessing the 'index' route, the user should be immediately redirected
 * to the 'chat' route.
 */
test('Accessing the index route', function (assert) {
  assert.expect(2)
  // Create route instance.
  const route = this.subject()

  // Stub function to be used to redirect the user.
  sinon.stub(route, 'transitionTo')

  // Invoke function to be tested.
  route.beforeModel()

  // Verify that the user has been redirected to the 'chat' route.
  assert.strictEqual(route.transitionTo.callCount, 1)
  assert.strictEqual(route.transitionTo.getCall(0).args[0], 'chat')

  // Restore stubbed function.
  route.get('transitionTo').restore()
})
