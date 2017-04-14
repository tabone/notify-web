import Ember from 'ember'
import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

/**
 * Stores the original value of window.WebSocket when tests are executed in
 * PhantomJS, since window.WebSocket will be an object and SinonJS won't be able
 * to stub it. For this reason in order to test the Socket Service, we replace
 * the window.WebSocket with a function and restore it once the tests are ready.
 * @type {Object}
 */
let phantomWebSocket = null

moduleFor('service:socket', 'Unit | Service | socket', {
  beforeEach: function beforeEach () {
    // When window.WebSocket is not a function (PhantomJS), we will backup the
    // current value and replace it with a stubbed function.
    if (typeof window.WebSocket !== 'function') {
      phantomWebSocket = window.WebSocket
      window.WebSocket = sinon.stub()
    } else {
      // Stub window.WebSocket.
      sinon.stub(window, 'WebSocket')
    }

    /**
     * Stubbing the Config Service.
     * @type {service}
     */
    const configStub = Ember.Service.extend({
      ws: { url: 'ws://hikupz.io/ws' }
    })

    /**
     * Stubbing the Store Service.
     * @type {service}
     */
    const storeStub = Ember.Service.extend({ push: sinon.stub() })

    /**
     * Stubbing the Message Cache Service.
     * @type {service}
     */
    const messageCacheStub = Ember.Service.extend({ cache: sinon.stub() })

    /**
     * Stubbing the Private Room Service.
     * @type {service}
     */
    const privateRoomCacheStub = Ember.Service.extend({ cache: sinon.stub() })

    this.register('service:config', configStub)
    this.register('service:store', storeStub)
    this.register('service:message-cache', messageCacheStub)
    this.register('service:private-room-cache', privateRoomCacheStub)

    this.inject.service('config')
    this.inject.service('store')
    this.inject.service('message-cache')
    this.inject.service('private-room-cache')
  },

  afterEach: function afterEach () {
    // If phantomWebSocket is not null, it means that tests are being made in
    // PhantomJS and we should therefore restore the original function. Else we
    // just have to restore the original function using SinonJS.
    if (phantomWebSocket === null) return window.WebSocket.restore()
    window.WebSocket = phantomWebSocket
  }
})

/**
 * When invoking the connect function, it should try to establish a WebSocket
 * connection with Notify's WebSocket server and store the WebSocket instance in
 * the service.
 */
test('Successfully establishing a WebSocket Connection', function (assert) {
  assert.expect(3)
  // Mocks the WebSocket instance. This is the instance returned when invoking
  // WebSocket constructor using the new keyword.
  const socketMock = {}
  window.WebSocket.returns(socketMock)

  // Create Socket Service instance.
  const socketInst = this.subject()

  // Try to establish a connection.
  return socketInst.connect().then(() => {
    // Verify that WebSocket has been invoked with a new keyword.
    assert.ok(window.WebSocket.calledWithNew())

    // Verify that it tried to connect with Notify's WebSocket server.
    assert.strictEqual(window.WebSocket.firstCall.args[0],
      socketInst.get('config.ws.url'))

    // Verify that WebSocket instance has been stored in the Service.
    assert.strictEqual(socketInst.get('socket'), socketMock)
  })
})

/**
 * When failing to establish a WebSocket connection, the connect function should
 * return a rejected promise.
 */
test('Failing to establishing a WebSocket Connection', function (assert) {
  assert.expect(1)
  // Mocks the WebSocket instance. This is the instance returned when invoking
  // WebSocket constructor using the new keyword.
  const socketMock = {}
  window.WebSocket.returns(socketMock)

  // Create Socket Service instance.
  const socketInst = this.subject()

  // Stub the WebSocket constructor to throw an error when invoked.
  window.WebSocket.throws()

  // Try to establish a connection.
  return socketInst.connect().catch(() => {
    // Verify that WebSocket instance has not been stored in the Service.
    assert.strictEqual(socketInst.get('socket'), null)
  })
})

/**
 * When retrieving a WebSocket payload about a private room, apart from updating
 * Ember Data Store we need to also store the private message inside the Private
 * Room Cache Service.
 */
test('Retrieving an update about a private room', function (assert) {
  assert.expect(4)
  // Mocks the WebSocket instance. This is the instance returned when invoking
  // WebSocket constructor using the new keyword.
  const socketMock = {}
  window.WebSocket.returns(socketMock)

  // Create Socket Service instance.
  const socketInst = this.subject()

  // Establish a connection.
  return socketInst.connect().then(() => {
    // Mocks the model to be returned when pushing the retrieved payload. For this
    // test it should be of type 'room' and should have its 'private' attribute
    // set to 'true'.
    const modelMock = Ember.Object.create({
      private: true,
      constructor: { modelName: 'room' }
    })
    socketInst.get('store.push').returns(modelMock)

    // Mocks the payload to be retrieved from WebSocket server.
    const payloadMock = { id: 'abc123' }

    // Invoke the onmessage function of the socket instance. This will be
    // invoked on retrieval of a payload sent by the WebSocket server.
    socketMock.onmessage({ data: JSON.stringify(payloadMock) })

    // Verify that the updated payload has been pushed to Ember Data Store.
    const pushStub = socketInst.get('store.push')
    assert.strictEqual(pushStub.callCount, 1)
    assert.strictEqual(pushStub.firstCall.args[0].id, payloadMock.id)

    // Verify that the updated room has been cached in the Private Room Cache
    // Service.
    const privateRoomCacheStub = socketInst.get('privateRoomCache.cache')
    assert.strictEqual(privateRoomCacheStub.callCount, 1)
    assert.strictEqual(privateRoomCacheStub.firstCall.args[0], modelMock)
  })
})

/**
 * When retrieving a WebSocket payload about a public room, all we have to do is
 * updating Ember Data Store.
 */
test('Retrieving an update about a public room', function (assert) {
  assert.expect(3)
  // Mocks the WebSocket instance. This is the instance returned when invoking
  // WebSocket constructor using the new keyword.
  const socketMock = {}
  window.WebSocket.returns(socketMock)

  // Create Socket Service instance.
  const socketInst = this.subject()

  // Establish a connection.
  return socketInst.connect().then(() => {
    // Mocks the model to be returned when pushing the retrieved payload. For
    // this test it should be of type 'room' and should have its 'private'
    // attribute set to 'false'.
    const modelMock = Ember.Object.create({
      private: false,
      constructor: { modelName: 'room' }
    })
    socketInst.get('store.push').returns(modelMock)

    // Mocks the payload to be retrieved from WebSocket server.
    const payloadMock = { id: 'abc123' }

    // Invoke the onmessage function of the socket instance. This will be invoked
    // on retrieval of a payload sent by the WebSocket server.
    socketMock.onmessage({ data: JSON.stringify(payloadMock) })

    // Verify that the updated payload has been pushed to Ember Data Store.
    const pushStub = socketInst.get('store.push')
    assert.strictEqual(pushStub.callCount, 1)
    assert.strictEqual(pushStub.firstCall.args[0].id, payloadMock.id)

    // Verify that the updated room has not been cached in the Private Room Cache
    // Service.
    const privateRoomCacheStub = socketInst.get('privateRoomCache.cache')
    assert.strictEqual(privateRoomCacheStub.callCount, 0)
  })
})

/**
 * When retrieving a WebSocket payload about a message, apart from updating
 * Ember Data Store, it should also update the Message Cache Service.
 */
test('Retrieving an update about a message', function (assert) {
  assert.expect(6)
  // Mocks the WebSocket instance. This is the instance returned when invoking
  // WebSocket constructor using the new keyword.
  const socketMock = {}
  window.WebSocket.returns(socketMock)

  // Create Socket Service instance.
  const socketInst = this.subject()

  // Establish a connection.
  return socketInst.connect().then(() => {
    // Mocks the model to be returned when pushing the retrieved payload. For
    // this test it should be of type 'message' and should have a 'room'
    // attribute.
    const modelMock = Ember.Object.create({
      constructor: { modelName: 'message' },
      room: {}
    })
    socketInst.get('store.push').returns(modelMock)

    // Mocks the payload to be retrieved from WebSocket server.
    const payloadMock = { id: 'abc123' }

    // Invoke the onmessage function of the socket instance. This will be invoked
    // on retrieval of a payload sent by the WebSocket server.
    socketMock.onmessage({ data: JSON.stringify(payloadMock) })

    // Verify that the updated payload has been pushed to Ember Data Store.
    const pushStub = socketInst.get('store.push')
    assert.strictEqual(pushStub.callCount, 1)
    assert.strictEqual(pushStub.firstCall.args[0].id, payloadMock.id)

    // Verify that the updated message has also been cached in Message Cache
    // Service.
    const messageCacheStub = socketInst.get('messageCache.cache')
    assert.strictEqual(messageCacheStub.callCount, 1)
    assert.strictEqual(messageCacheStub.firstCall.args[0], modelMock.get('room'))
    assert.strictEqual(messageCacheStub.firstCall.args[1], false)
    assert.strictEqual(messageCacheStub.firstCall.args[2], modelMock)
  })
})
