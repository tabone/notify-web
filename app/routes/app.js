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

  beforeModel () {
    // If the user is trying to access the app while not authenticated, he
    // should be redirected to the login page.
    if (this.get('session').isLoggedIn() === false) this.transitionTo('index')

    // Connect with WebSocket server.
    return this.get('socket').connect()
  },

  model () {
    return RSVP.hash({
      // Retrieve all users, the current logged in user can interact with.
      users: this.get('store').findAll('user'),

      // Retrieve all the rooms which the current logged in user is a member of.
      rooms: this.get('store').query('room', {
        filter: {
          users: {
            id: this.get('session').get('user').get('id')
          }
        }
      })
    })
  }
});
