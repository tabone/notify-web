import Ember from 'Ember'
import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

moduleFor('route:chat/room', 'Unit | Route | chat/room', {
  beforeEach: function beforeEach () {
    /**
     * Stubbing the Store Service.
     * @type {service}
     */
    const storeStub = Ember.Service.extend({
      findRecord: sinon.stub()
    })

    this.register('service:store', storeStub)
    this.inject.service('store')
  }
})

/**
 * When accessing the room route with 'null' as the id of the room (this happens
 * when the user refreshes the page while viewing a non-persisted private room),
 * it should redirect the user to the 'chat' route.
 */
test('Accessing the `room` route with an invalid room id', function (assert) {
  // Create a route instance.
  const route = this.subject()

  // Stub the function used to redirect the user to the 'chat' route.
  const transitionToStub = sinon.stub(route, 'transitionTo')

  // Invoke the function to be tested.
  route.model({ 'room_id': 'null' })

  // Verify that the transition function has been invoked once.
  assert.strictEqual(transitionToStub.callCount, 1)
  //Verify that the user is redirected to the chat route.
  assert.strictEqual(transitionToStub.getCall(0).args[0], 'chat')
  // Verify that no requests are done to retrieve teh model of the route.
  assert.strictEqual(route.get('store.findRecord').callCount, 0)

  // Restore transition to function.
  route.transitionTo.restore()
})

/**
 * When accessing the 'room' route with a valid room id, it should do a request
 * to retrieve the model of the route.
 */
test('Accessing the `room` route with an valid room id', function (assert) {
  // Create a route instance.
  const route = this.subject()

  // Stub the function that can be used to redirect the user.
  sinon.stub(route, 'transitionTo')
  // Store findRecord stub.
  const findRecordStub = route.get('store.findRecord')

  // Room ID
  const id = 'abc123'

  // Invoke the function to be tested.
  route.model({ 'room_id': id })

  // Verify that the user has not been redirected.
  assert.strictEqual(route.transitionTo.callCount, 0)

  // Verify that a request was done to retrieve the model of the route.
  assert.strictEqual(findRecordStub.callCount, 1)
  // Verify that the request has been done or a 'room' type with the same id as
  // the one passed.
  assert.strictEqual(findRecordStub.getCall(0).args[0], 'room')
  assert.strictEqual(findRecordStub.getCall(0).args[1], id)

  // Restore transition to function.
  route.transitionTo.restore()
})
