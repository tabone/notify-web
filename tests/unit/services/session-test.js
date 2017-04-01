import Ember from 'ember'
import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

moduleFor('service:session', 'Unit | Service | session', {
  beforeEach: function beforeEach () {
    /**
     * Stubbing the Config Service.
     * @type {service}
     */
    const configStub = Ember.Service.extend({
      auth: {
        url: 'http://hikupz.io/auth'
      }
    })

    /**
     * Stubbing the Store Service.
     * @type {service}
     */
    const storeStub = Ember.Service.extend({
      findRecord: sinon.stub()
    })

    this.register('service:store', storeStub)
    this.register('service:config', configStub)

    this.inject.service('store')
    this.inject.service('config')
  }
})

/**
 * When checking if a user is logged in, if the Session Service has a reference
 * to a user, it should consider the user to be logged in.
 */
test('Checking if user is logged in', function (assert) {
  assert.expect(2)
  // Create Session Service instance.
  const sessionInst = this.subject()

  // Verify that when the Session Service doesn't have a reference to a user, it
  // should consider the user to be logged out.
  assert.strictEqual(sessionInst.isLoggedIn(), false)

  // Set a reference to the Session Service user.
  sessionInst.set('user', Ember.Object.create())

  // Verify that when the Session Service has a reference to a user, it is
  // should consider the user to be logged in.
  assert.strictEqual(sessionInst.isLoggedIn(), true)
})

/**
 * When trying to log in, if the auth succeeds, it should return the ID for
 * the authenticated user with the HTTP Response for the app to do another
 * request to retrieve the user model so that it can store it inside the Session
 * Service.
 */
test('Successfully logging in', function (assert) {
  assert.expect(5)
  // Create Session Service instance.
  const sessionInst = this.subject()

  // Array to contain the XHR Requests done.
  const requests = []
  // Mock XHR Request.
  const xhr = sinon.useFakeXMLHttpRequest()
  // Store any requests done by the login() method.
  xhr.onCreate = requests.push.bind(requests)

  // ID of the user who will be logging in.
  const userID = '1'

  /**
   * Mocking the logged in user returned by the store.
   * @type {Object}
   */
  const mockUser = Ember.Object.create({ id: userID })

  // Mock findRecord function to return the mocked user.
  sessionInst.get('store').findRecord.returns(mockUser)

  // Try logging in.
  const loginPromise = sessionInst.login()

  // Respond with a Successful Auth Request.
  requests[0].respond(200, {'Content-Type': 'application/json'},
    `{"id": "${userID}"}`)

  // Do Assertions.
  return loginPromise.then(() => {
    const findRecord = sessionInst.get('store').findRecord

    // Should only do 1 XHR Request.
    assert.strictEqual(requests.length, 1)

    // Should do a request for the user model
    assert.strictEqual(findRecord.callCount, 1)
    assert.strictEqual(findRecord.firstCall.args[0], 'user')
    assert.strictEqual(findRecord.firstCall.args[1], '1')

    // Should store the user model requested in the Session Service.
    assert.strictEqual(sessionInst.get('user'), mockUser)
  }).catch(() => {
    assert.ok(false)
  }).then(xhr.restore.bind(xhr))
})

/**
 * When trying to log in, if the auth fails, the login method should return a
 * rejected promise and it should not store a reference to a user in the Session
 * Service.
 */
test('Unsuccessfully logging in', function (assert) {
  assert.expect(3)
  // Create Session Service instance.
  const sessionInst = this.subject()

  // Array to contain the XHR Requests done.
  const requests = []
  // Mock XHR Request.
  const xhr = sinon.useFakeXMLHttpRequest()
  // Store any requests done by the login() method inside requests array.
  xhr.onCreate = requests.push.bind(requests)

  // Try logging in.
  const loginPromise = sessionInst.login()

  // Respond with a HTTP 401 Status.
  requests[0].respond(401)

  // Do Assertions.
  return loginPromise.then(() => {
    assert.ok(false)
  }).catch(() => {
    // Did 1 request
    assert.strictEqual(requests.length, 1)
    // Session Service does not have a reference to a user.
    assert.strictEqual(sessionInst.get('user'), null)
    // No requests where done to retrieve the logged in user.
    assert.strictEqual(sessionInst.get('store').findRecord.callCount, 0)
  }).then(xhr.restore.bind(xhr))
})

/**
 * When logging out, it should remove the user reference from the Session
 * Service.
 */
test('Logging out', function (assert) {
  assert.expect(2)

  // Create Session Service instance.
  const sessionInst = this.subject()

  // Configure the Session Service to have a reference to a user.
  sessionInst.set('user', Ember.Object.create())

  // Verify that the Session Service is considered to be logged in.
  assert.strictEqual(sessionInst.isLoggedIn(), true)
  // Logout
  sessionInst.logout()
  // Verify that the Session Service is considered to be logged out.
  assert.strictEqual(sessionInst.isLoggedIn(), false)
})
