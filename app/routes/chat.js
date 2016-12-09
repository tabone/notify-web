import Ember from 'ember';
import RSVP from 'rsvp'

export default Ember.Route.extend({
  /**
   * session service is used to manage the session info.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * socket service is used to communicate with the WebSocket server.
   * @type {service:socket}
   */
  socket: Ember.inject.service(),

  /**
   * privateRoomCache is used to cache private rooms by the friend id.
   * @type {service:private-room-cache}
   */
  privateRoomCache: Ember.inject.service(),

  beforeModel () {
    // If the user is trying to access the app while not authenticated, he
    // should be redirected to the login page.
    if (this.get('session').isLoggedIn() === false) this.transitionTo('index')

    // Connect with WebSocket server.
    return this.get('socket').connect()
  },

  model () {
    return RSVP.hash({
      // Retrieve and cache all states.
      states: this.get('store').findAll('state'),

      // Retrieve all non bot users, the current logged in user can interact
      // with.
      users: this.get('store').query('user', {
        filter: {
          bot: false
        }
      }),

      // Retrieve all the rooms which the current logged in user is a member of.
      rooms: this.get('store').findAll('room').then(rooms => {
        // Store room if it is a private room.
        rooms.forEach(room => this.get('privateRoomCache').cache(room))
        return rooms
      })
    })
  }
});
