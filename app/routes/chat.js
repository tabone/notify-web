import Ember from 'ember'
import RSVP from 'rsvp'

/**
 * This route gets invoked when the user enters the chat route. In this route
 * before rendering the DOM, a new WebSocket connection is established & the
 * following info is retrieved:
 *   > List of all STATES.
 *   > List of all GRANTS.
 *   > List of all USERS.
 *   > List of all ROOMS which the logged in user is a member of.
 * Note that since rooms are dependent on the users (when a room does not have a
 * name it uses the members usernames as its name), the rooms are retrieved
 * after the retrieval users info.
 */
export default Ember.Route.extend({
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
      }).then(rooms => {
        hash.rooms = rooms
        return hash
      })
    })
  }
})
