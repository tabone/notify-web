import Ember from 'ember';

export default Ember.Component.extend({
  privateRoomCache: Ember.inject.service(),

  room: null,

  init (...args) {
    this._super(...args)

    /**
     * friendID is the user id of the friend clicked.
     * @type {String}
     */
    const friendID = this.get('user.id')

    /**
     * room is the private room of the logged in user and the friend.
     * @type {Record}
     */
    const room = this.get('privateRoomCache').read(friendID)

    // Store private room.
    this.set('room', room)
  }
});
