import Ember from 'ember'
import { moduleFor, test } from 'ember-qunit'

moduleFor('service:message-cache', 'Unit | Service | message cache', {})

/**
 * When caching a list of messages related to an invalid room (id == null), it
 * should not cache the messages.
 */
test('Caching a list of messages of an invalid room', function (assert) {
  assert.expect(1)
  // Create Message Cache instance.
  const messageCache = this.subject()

  // List of messages to be cached.
  const messages = [
    Ember.Object.create(),
    Ember.Object.create(),
    Ember.Object.create()
  ]

  // Room which the messages have been written in.
  const room = Ember.Object.create({})

  // Cache messages.
  messageCache.cache(room, true, ...messages)

  // Verify that the messages have not been cached.
  assert.strictEqual(Object.keys(messageCache.get('messages')).length, 0)
})

/**
 * When caching a list of new messages, it should prepend the messages.
 */
test('Caching a list of new messages', function (assert) {
  assert.expect(5)
  // Create Message Cache instance.
  const messageCache = this.subject()

  // List of messages to be cached.
  const messages = [
    Ember.Object.create(),
    Ember.Object.create(),
    Ember.Object.create()
  ]

  // Room which the messages have been written in.
  const room = Ember.Object.create({ id: '1' })

  // Cache messages.
  messageCache.cache(room, true, ...messages)

  // Retrieve cached messages.
  const cachedMessages = messageCache.get(`messages.${room.get('id')}`)
  const noCachedMessages = cachedMessages.get('length')

  // Verify that a single entry has been created in the list of messages.
  assert.strictEqual(Object.keys(messageCache.get('messages')).length, 1)

  // Verify that the number of cached messages amounts to the number of messages
  // provided to be cached.
  assert.strictEqual(noCachedMessages, messages.get('length'))

  // Verify that the messages have been prepended.
  cachedMessages.forEach((message, index) => {
    assert.strictEqual(message,
      messages.objectAt((noCachedMessages - 1) - index))
  })
})

/**
 * When caching a list of persisted messages, it should append the messages.
 */
test('Caching a list of persisted messages', function (assert) {
  assert.expect(5)
  // Create Message Cache instance.
  const messageCache = this.subject()

  // List of messages to be cached.
  const messages = [
    Ember.Object.create(),
    Ember.Object.create(),
    Ember.Object.create()
  ]

  // Room which the messages have been written in.
  const room = Ember.Object.create({ id: '1' })

  // Cache messages.
  messageCache.cache(room, false, ...messages)

  // Retrieve cached messages.
  const cachedMessages = messageCache.get(`messages.${room.get('id')}`)
  const noCachedMessages = cachedMessages.get('length')

  // Verify that a single entry has been created in the list of messages.
  assert.strictEqual(Object.keys(messageCache.get('messages')).length, 1)

  // Verify that the number of cached messages amounts to the number of messages
  // provided to be cached.
  assert.strictEqual(noCachedMessages, messages.get('length'))

  // Verify that the messages have been appended.
  cachedMessages.forEach((message, index) => {
    assert.strictEqual(message, messages.objectAt(index))
  })
})

/**
 * When trying to cache a message that is has already been cached, it should not
 * cache it twice.
 */
test('Caching an already cached message', function (assert) {
  assert.expect(1)
  // Create Message Cache instance.
  const messageCache = this.subject()

  // Message to be cached.
  const message = Ember.Object.create()

  // Room which the messages have been written in.
  const room = Ember.Object.create({ id: '1' })

  // Cache a message twice.
  messageCache.cache(room, false, message)
  messageCache.cache(room, false, message)

  // Retrieve cached messages.
  const cachedMessages = messageCache.get(`messages.${room.get('id')}`)

  // Verify that the message has only been added once.
  assert.strictEqual(cachedMessages.get('length'), 1)
})

/**
 * When reading the cached messages of a an invalid room (id === null), it
 * should do nothing and return null.
 * When reading the cached messages of an invalid room (id === null), it should
 * return null and should not create an entry for the requested room.
 */
test('Reading the cached messages of a non-cached room', function (assert) {
  assert.expect(2)
  // Create Message Cache instance.
  const messageCache = this.subject()

  // Invalid room (i.e. no ID).
  const room = Ember.Object.create()

  // Try reading the messages of an invalid room.
  const messages = messageCache.read(room)

  // Verify that no messages have been returned.
  assert.deepEqual(messages, null)
  // Verify that no entry has been created in the list of cached messages for
  // the requested room.
  assert.strictEqual(Object.keys(messageCache.get(`messages`)).length, 0)
})

/**
 * When reading the cached messages of a non-cached room, it should create a new
 * entry for the requested room and return the same array which the service will
 * use to cache the messages for the requested room.
 */
test('Reading the cached messages of a non-cached room', function (assert) {
  assert.expect(2)
  // Create Message Cache instance.
  const messageCache = this.subject()

  // Room which we will be reading the cached messages from.
  const room = Ember.Object.create({ id: '1' })

  // Try reading the cached messages of a room which does not have an entry in
  // the Message Cache Service.
  const messages = messageCache.read(room)

  // Verify that it an empty array has been returned.
  assert.deepEqual(messages, [])

  // Verify that the returned array is the same array instance used to store
  // cached messages for the requested room inside the Message Cache Service.
  assert.strictEqual(messageCache.get(`messages.${room.get('id')}`), messages)
})

/**
 * When reading the cached messages of a cached room, it should return the
 * messages of the room requested.
 */
test('Reading the cached messages of a cached room', function (assert) {
  assert.expect(1)
  // Create Message Cache instance.
  const messageCache = this.subject()

  // List of messages to be cached.
  const messages = [
    Ember.Object.create(),
    Ember.Object.create(),
    Ember.Object.create()
  ]

  // Room which the messages have been written in.
  const room = Ember.Object.create({ id: '1' })

  // Cache messages.
  messageCache.cache(room, false, ...messages)

  // Retrieve cached messages.
  const cached = messageCache.read(room)

  // Verify that the returned array is the same array instance used to store
  // cached messages for the requested room inside the Message Cache Service.
  assert.strictEqual(messageCache.get(`messages.${room.get('id')}`), cached)
})
