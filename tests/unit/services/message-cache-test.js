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

  // Do Assertion
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

  // Do assertions
  assert.strictEqual(Object.keys(messageCache.get('messages')).length, 1)
  assert.strictEqual(noCachedMessages, messages.get('length'))

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

  // Do assertions
  assert.strictEqual(Object.keys(messageCache.get('messages')).length, 1)
  assert.strictEqual(noCachedMessages, messages.get('length'))

  cachedMessages.forEach((message, index) => {
    assert.strictEqual(message, messages.objectAt(index))
  })
})

/**
 * When reading the cached messages of a an invalid room (id === null), it
 * should do nothing and return null.
 */
test('Reading the cached messages of a non-cached room', function (assert) {
  assert.expect(2)
  // Create Message Cache instance.
  const messageCache = this.subject()

  const room = Ember.Object.create()
  const messages = messageCache.read(room)

  assert.deepEqual(messages, null)
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

  const room = Ember.Object.create({ id: '1' })
  const messages = messageCache.read(room)

  assert.deepEqual(messages, [])
  assert.strictEqual(messageCache.get(`messages.${room.get('id')}`), messages)
})

/**
 * When reading the cached messages of a cached room, it should return the
 * messages of the room requested.
 */
test('Reading the cached messages of a cached room', function (assert) {
  assert.expect(3)
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
  const cachedMessages = messageCache.read(room)

  // Do Assertions
  cachedMessages.forEach((message, index) => {
    assert.strictEqual(message, messages.objectAt(index))
  })
})
