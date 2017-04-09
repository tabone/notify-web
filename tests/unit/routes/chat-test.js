import Ember from 'ember'
import RSVP from 'rsvp'
import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

moduleFor('route:chat', 'Unit | Route | chatZ', {
  beforeEach: function beforeEach () {
    /**
     * Stubbing the Socket Service.
     * @type {service}
     */
    const socketStub = Ember.Service.extend({
      connect: sinon.stub()
    })

    /**
     * Stubbing the Store Service.
     * @type {service}
     */
    const storeStub = Ember.Service.extend({
      findAll: sinon.stub()
    })

    /**
     * Stubbing the Private Room Cache Service.
     * @type {service}
     */
    const privateRoomCacheStub = Ember.Service.extend({
      cache: sinon.stub()
    })

    this.register('service:store', storeStub)
    this.register('service:socket', socketStub)
    this.register('service:privateRoomCache', privateRoomCacheStub)
    this.inject.service('store')
    this.inject.service('socket')
    this.inject.service('privateRoomCache')
  }
})

/**
 * When accessing the Chat Route, before it retrieves the model of the route it
 * tries to establish a a WebSocket connection. If the connection is established
 * the beforeModel model hook should return a fulfilled promise.
 */
test('Successfully establishing a WebSocket Connection', function (assert) {
  assert.expect(1)
  // Create Chat Route instance.
  const route = this.subject()

  // Stub the function used to establish a WebSocket connection to return a
  // fulfilled promise.
  route.get('socket.connect').returns(RSVP.Promise.resolve())

  // Invoke function to be tested.
  return route.beforeModel().then(() => {
    // Verify that an attempt has been done to establish a WebSocket connection.
    assert.strictEqual(route.get('socket').connect.callCount, 1)
  })
})

/**
 * When accessing the Chat Route, before it retrieves the model of the route it
 * tries to establish a a WebSocket connection. If the connection is not
 * established the beforeModel model hook should return a rejected promise.
 */
test('Successfully establishing a WebSocket Connection', function (assert) {
  assert.expect(1)
  // Create Chat Route instance.
  const route = this.subject()

  // Stub the function used to establish a WebSocket connection to return a
  // rejected promise.
  route.get('socket.connect').returns(RSVP.Promise.reject())

  // Invoke function to be tested.
  return route.beforeModel().catch(() => {
    // Verify that an attempt has been done to establish a WebSocket connection.
    assert.strictEqual(route.get('socket').connect.callCount, 1)
  })
})

/**
 * When accessing the Chat Route before it renders the DOM the app retrieves
 * info about the USERS, GRANTS, STATES and the ROOMS which the logged in user
 * is a member of.
 */
test('Retrieving the route model successfully', function (assert) {
  assert.expect(13)
  // Create Chat Route instance.
  const route = this.subject()

  /**
   * List of users to be retrieved
   * @type {Array}
   */
  const users = []

  /**
   * List of states to be retrieved
   * @type {Array}
   */
  const states = []

  /**
   * List of grants to be retrieved
   * @type {Array}
   */
  const grants = []

  /**
   * List of grants to be retrieved
   * @type {Array}
   */
  const rooms = [ Ember.Object.create(), Ember.Object.create() ]

  // Get a reference for the store.findAll stub.
  const findAllStub = route.get('store.findAll')
  // Get a reference for the privateRoomCache.cache stub.
  const cacheStub = route.get('privateRoomCache.cache')

  // Configure the store.findAll stub to return the expected values.
  findAllStub.withArgs('user').returns(RSVP.Promise.resolve(users))
  findAllStub.withArgs('state').returns(RSVP.Promise.resolve(states))
  findAllStub.withArgs('grant').returns(RSVP.Promise.resolve(grants))
  findAllStub.withArgs('room').returns(RSVP.Promise.resolve(rooms))

  // Invoke function to be tested.
  return route.model().then(model => {
    // Verify that the findAll stub has been invoked 4 times.
    assert.strictEqual(findAllStub.callCount, 4)
    // Verify that the findAll stub has been invoked with the expected
    // arguments.
    assert.strictEqual(findAllStub.getCall(0).args[0], 'state')
    assert.strictEqual(findAllStub.getCall(1).args[0], 'grant')
    assert.strictEqual(findAllStub.getCall(2).args[0], 'user')
    assert.strictEqual(findAllStub.getCall(3).args[0], 'room')

    // Verify that the model returned has 4 attributes.
    assert.strictEqual(Object.keys(model).length, 4)
    // Verify that the values of the attributes are as expected.
    assert.strictEqual(model.users, users)
    assert.strictEqual(model.states, states)
    assert.strictEqual(model.grants, grants)
    assert.strictEqual(model.rooms, rooms)

    // Verify that the privateRoomCache cache stub has been invoked for each
    // room retrieved from the findAll function.
    assert.strictEqual(cacheStub.callCount, rooms.length)
    assert.strictEqual(cacheStub.getCall(0).args[0], rooms[0])
    assert.strictEqual(cacheStub.getCall(1).args[0], rooms[1])
  })
})

/**
 * When the Chat Route fails to retrieve the model, it should return a rejected
 * Promise.
 */
test('Retrieving the route model unsuccessfully', function (assert) {
  assert.expect(1)
  // Create Chat Route instance.
  const route = this.subject()

  // Get a reference for the store.findAll stub.
  const findAllStub = route.get('store.findAll')

  // Configure the store.findAll stub to return the expected values.
  findAllStub.withArgs('user').returns(RSVP.Promise.resolve())
  findAllStub.withArgs('state').returns(RSVP.Promise.resolve())
  findAllStub.withArgs('grant').returns(RSVP.Promise.reject()) // Will Fail.

  // Verify that the model function returns a rejected promise.
  return route.model().catch(model => assert.ok(true))
})
