import Ember from 'ember'
import { moduleFor, test } from 'ember-qunit'

/**
 * Stubbing the Session Service.
 * @type {service}
 */
const sessionStub = Ember.Service.extend({})

/**
 * Stubbing the Store Service.
 * @type {service}
 */
const storeStub = Ember.Service.extend({})

moduleFor('service:private-room-cache', 'Unit | Service | private room cache', {
  beforeEach: function beforeEach () {
    this.register('service:session', sessionStub)
    this.register('service:store', storeStub)

    this.inject.service('session')
    this.inject.service('store')
  }
})

/**
 * When trying to cache a public room, it should not cache it.
 */
test('Cache a public room', function (assert) {
  assert.expect(1)

  // Private Room Cache instance.
  const roomCache = this.subject({ rooms: {} })

  // Public room to be cached.
  const room = Ember.Object.create({
    private: false,
    users: [ Ember.Object.create({}), Ember.Object.create({}) ]
  })

  // Try caching the public room.
  roomCache.cache(room)

  // Do Assertions.
  assert.strictEqual(Object.keys(roomCache.get('rooms')).length, 0)
})

/**
 * When trying to cache a private room, which do not have 2 members, it should
 * not cache it.
 */
test('Cache a private room which does not have 2 members', function (assert) {
  assert.expect(1)

  // Private Room Cache instance.
  const roomCache = this.subject({ rooms: {} })

  // Invalid private room to be cached.
  const room = Ember.Object.create({
    private: true,
    users: [ Ember.Object.create({}) ]
  })

  // Try caching the invalid private room.
  roomCache.cache(room)

  // Do Assertions.
  assert.strictEqual(Object.keys(roomCache.get('rooms')).length, 0)
})

/**
 * When trying to cache a private room, which has 2 members, it should cache it
 * and index it by the friend ID.
 */
test('Cache a valid private room', function (assert) {
  assert.expect(2)

  // Logged in user.
  const user = Ember.Object.create({ id: 1 })
  // Friend ID.
  const friend = Ember.Object.create({ id: 2 })

  // Private Room Cache instance.
  const roomCache = this.subject({ rooms: {} })

  // Store logged in user in Session Service.
  roomCache.set('session.user', user)

  // Private Room to be cached.
  const room = Ember.Object.create({
    private: true,
    users: [ user, friend ]
  })

  // Cache Private Room.
  roomCache.cache(room)

  // Do Assertions.
  assert.strictEqual(Object.keys(roomCache.get('rooms')).length, 1)
  assert.strictEqual(roomCache.get(`rooms.${friend.id}`), room)
})

/**
 * When trying to read a cached private room, if the room is cached, it should
 * return the cached room.
 */
test('Read a cached private room', function (assert) {
  assert.expect(1)

  // Private Room Cache instance.
  const roomCache = this.subject({ rooms: {} })

  // The ID of the friend which the room is indexed with.
  const friendID = 1

  // Private room to read.
  const cachedRoom = Ember.Object.create()

  // Cache Room.
  roomCache.set(`rooms.${friendID}`, cachedRoom)

  // Do Assertion.
  assert.strictEqual(roomCache.read(friendID), cachedRoom)
})

/**
 * When trying to read a cached private room, if the room is not cached, it
 * should create and return a new private room with the logged in user and the
 * friend as members.
 */
test('Read a non-cached private room', function (assert) {
  assert.expect(4)

  // Logged in user.
  const user = Ember.Object.create({ id: 1 })
  // Friend ID.
  const friend = Ember.Object.create({ id: 2 })

  // Private Room Cache instance.
  const roomCache = this.subject({ rooms: {} })

  // Store logged in user in Session Service.
  roomCache.set('session.user', user)

  // Mock peekRecord function.
  roomCache.get('store').peekRecord = (type, id) => {
    return (type === 'user' && id === friend.get('id')) ? friend : null
  }

  // Mock createRecord function.
  roomCache.get('store').createRecord = (type, obj) => {
    return (type === 'room') ? Ember.Object.create(obj) : null
  }

  // Read non-cached private room.
  const newRoom = roomCache.read(friend.get('id'))

  // Do Assertions
  assert.strictEqual(roomCache.get(`rooms.${friend.get('id')}`), newRoom)
  assert.strictEqual(newRoom.get('private'), true)
  assert.strictEqual(newRoom.get('users')[0], user)
  assert.strictEqual(newRoom.get('users')[1], friend)
})
