import Ember from 'ember'
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

  /**
   * beforeModel hook is the first of the route entry validation hooks called.
   */
  beforeModel () {
    // Connect with WebSocket server.
    return this.get('socket').connect()
  },

  /**
   * model hook is used to convert the url to a model.
   */
  model () {
    return RSVP.hash({
      // Retrieve and cache all states.
      states: this.get('store').findAll('state'),

      // Retrieve and cache all grants.
      grants: this.get('store').findAll('grant'),

      // Retrieve all users.
      users: this.get('store').findAll('user')
    }).then(hash => {
      // Retrieve all the rooms which the current logged in user is a member of.
      // Since there are times when rooms use user info (when room doesn't have
      // a name), rooms should be retrieved once all users are retrieved.
      return this.get('store').findAll('room').then(rooms => {
        // Store room if it is a private room.
        rooms.forEach(room => this.get('privateRoomCache').cache(room))
        return rooms
      }).then((rooms) => {
        hash.rooms = rooms
        return hash
      })
    })
  }
})
