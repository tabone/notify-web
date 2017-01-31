import Ember from 'ember';

/**
 * This service is used to index the private rooms by the friend id.
 */
export default Ember.Service.extend({
  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * store service to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),

  /**
   * rooms cached by the friend ID.
   * @type {Object}
   */
  rooms: {},

  /**
   * cache room only if it is a private room.
   * @param  {Record} room The room to be cached.
   */
  cache (room) {
    // Don't cache room if room to be cached is not a private room.
    if (room.get('private') !== true) return

    // A private room should only have 2 members.
    if (room.get('users.length') !== 2) return

    /**
     * user is the logged in user.
     * @type {Record}
     */
    const user = this.get('session.user')

    /**
     * users are the users who are a member of the room to be added.
     * @type {[type]}
     */
    const users = room.get('users')

    /**
     * friend is the other user inside the private room.
     * @type {Record}
     */
    const friend = (user === users.get('firstObject'))
      ? users.get('lastObject')
      : users.get('firstObject')

    // Cache room by the friend's id.
    this.set(`rooms.${friend.id}`, room)
  },

  /**
   * read cached private room.
   * @param  {String} friendID The id of the friend.
   * @return {Record}          Private room instance.
   */
  read (friendID) {
    const key = `rooms.${friendID}`

    // Return private room if it is cached.
    if (this.get(key) !== undefined) return this.get(key)

    // If it isn't we need to create it
    const store = this.get('store')

    // Retrieve looged in user.
    const user = this.get('session.user')
    // Retrieved friend.
    const friend = store.peekRecord('user', friendID)

    // Create room with logged in user & his friend.
    const room = store.createRecord('room', {
      private: true,
      users: [user, friend]
    })

    // Cache the room created.
    this.cache(room)

    return room
  }
});
