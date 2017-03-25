import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

moduleFor('service:notification', 'Unit | Service | notification', {
})

/**
 * When adding an invalid listener (i.e. listener is not function), it should
 * not add the provided listener.
 */
test('Adding an invalid listener', function (assert) {
  assert.expect(1)
  const notification = this.subject()
  notification.addListener('invalid listener')
  assert.strictEqual(notification.get('listeners.length'), 0)
})

/**
 * When adding a valid listener (i.e. listener is a function), it should add the
 * provided listener.
 */
test('Adding a valid listener', function (assert) {
  assert.expect(1)
  const notification = this.subject()
  notification.addListener(function validListener () {})
  assert.strictEqual(notification.get('listeners.length'), 1)
})

/**
 * When emitting an info notification, it should notify all the listeners about
 * the notification type and message.
 */
test('Emitting an info notification', function (assert) {
  assert.expect(9)

  // Notification instance.
  const notification = this.subject()

  // Listeners.
  const listenerOne = sinon.spy()
  const listenerTwo = sinon.spy()
  const listenerThree = sinon.spy()

  // Adding listeners to notification intance.
  notification.addListener(listenerOne)
  notification.addListener(listenerTwo)
  notification.addListener(listenerThree)

  // Notification type
  const type = 'info'
  // Notification message
  const msg = 'a notification'

  // Emit notification
  notification[type](msg)

  // Do Assertions
  ;[listenerOne, listenerTwo, listenerThree].forEach(listener => {
    assert.strictEqual(listener.callCount, 1)
    assert.strictEqual(listener.firstCall.args[0].type, type)
    assert.strictEqual(listener.firstCall.args[0].message, msg)
  })
})

/**
 * When emitting an error notification, it should notify all the listeners about
 * the notification type and message.
 */
test('Emitting an error notification', function (assert) {
  assert.expect(9)

  // Notification instance.
  const notification = this.subject()

  // Listeners.
  const listenerOne = sinon.spy()
  const listenerTwo = sinon.spy()
  const listenerThree = sinon.spy()

  // Adding listeners to notification intance.
  notification.addListener(listenerOne)
  notification.addListener(listenerTwo)
  notification.addListener(listenerThree)

  // Notification type
  const type = 'error'
  // Notification message
  const msg = 'a notification'

  // Emit notification
  notification[type](msg)

  // Do Assertions
  ;[listenerOne, listenerTwo, listenerThree].forEach(listener => {
    assert.strictEqual(listener.callCount, 1)
    assert.strictEqual(listener.firstCall.args[0].type, type)
    assert.strictEqual(listener.firstCall.args[0].message, msg)
  })
})

/**
 * When emitting a warning notification, it should notify all the listeners
 * about the notification type and message.
 */
test('Emitting a warning notification', function (assert) {
  assert.expect(9)

  // Notification instance.
  const notification = this.subject()

  // Listeners.
  const listenerOne = sinon.spy()
  const listenerTwo = sinon.spy()
  const listenerThree = sinon.spy()

  // Adding listeners to notification intance.
  notification.addListener(listenerOne)
  notification.addListener(listenerTwo)
  notification.addListener(listenerThree)

  // Notification type
  const type = 'warning'
  // Notification message
  const msg = 'a notification'

  // Emit notification
  notification[type](msg)

  // Do Assertions
  ;[listenerOne, listenerTwo, listenerThree].forEach(listener => {
    assert.strictEqual(listener.callCount, 1)
    assert.strictEqual(listener.firstCall.args[0].type, type)
    assert.strictEqual(listener.firstCall.args[0].message, msg)
  })
})

/**
 * When emitting a success notification, it should notify all the listeners
 * about the notification type and message.
 */
test('Emitting a success notification', function (assert) {
  assert.expect(9)

  // Notification instance.
  const notification = this.subject()

  // Listeners.
  const listenerOne = sinon.spy()
  const listenerTwo = sinon.spy()
  const listenerThree = sinon.spy()

  // Adding listeners to notification intance.
  notification.addListener(listenerOne)
  notification.addListener(listenerTwo)
  notification.addListener(listenerThree)

  // Notification type
  const type = 'success'
  // Notification message
  const msg = 'a notification'

  // Emit notification
  notification[type](msg)

  // Do Assertions
  ;[listenerOne, listenerTwo, listenerThree].forEach(listener => {
    assert.strictEqual(listener.callCount, 1)
    assert.strictEqual(listener.firstCall.args[0].type, type)
    assert.strictEqual(listener.firstCall.args[0].message, msg)
  })
})

/**
 * When emitting a non-standard notification, it should notify all the listeners
 * about the notification type and message.
 */
test('Emitting a non-standard notification', function (assert) {
  assert.expect(9)

  // Notification instance.
  const notification = this.subject()

  // Listeners.
  const listenerOne = sinon.spy()
  const listenerTwo = sinon.spy()
  const listenerThree = sinon.spy()

  // Adding listeners to notification intance.
  notification.addListener(listenerOne)
  notification.addListener(listenerTwo)
  notification.addListener(listenerThree)

  // Notification type
  const type = 'non-standard'
  // Notification message
  const msg = 'a notification'

  // Emit notification
  notification.emit(type, msg)

  // Do Assertions
  ;[listenerOne, listenerTwo, listenerThree].forEach(listener => {
    assert.strictEqual(listener.callCount, 1)
    assert.strictEqual(listener.firstCall.args[0].type, type)
    assert.strictEqual(listener.firstCall.args[0].message, msg)
  })
})
