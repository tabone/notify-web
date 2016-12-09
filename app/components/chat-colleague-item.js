import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * privateRoomCache is used to cache private rooms by the friend id.
   * @type {service:private-room-cache}
   */
  privateRoomCache: Ember.inject.service(),

  /**
   * room is the private room of the user being displayed and the logged in
   * user.
   * @type {Record}
   */
  room: null,

  actions: {
    /**
     * openRoom opens the private room between the user this component is
     * representing and the logged in user.
     */
    openRoom () {
      let room = this.get('room')

      if (room === null) {
        room = this.get('privateRoomCache').read(this.get('user.id'))
      }

      this.set('room', room)
      this.get('router').transitionTo('chat.room', room)
    }
  }
});
