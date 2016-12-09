import Ember from 'ember';

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
   * cache room if it is a private room.
   * @param  {Record} room The room to be cached.
   */
  cache (room) {
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

    this.set(`rooms.${friend.id}`, room)
  },

  /**
   * read cached private room. When requesting a private room that does not
   * exists a new one is created.
   * @param  {String} friendID The id of the friend.
   * @return {Record}          Private room instance.
   */
  read (friendID) {
    const key = `rooms.${friendID}`
    if (this.get(key) !== undefined) return this.get(key)
    const store = this.get('store')

    const user = this.get('session.user')
    const friend = store.peekRecord('user', friendID)

    const room = store.createRecord('room', {
      private: true,
      users: [user, friend]
    })

    this.cache(room)

    return room
  }
});
