import Ember from 'ember'

/**
 * Service used to store common configuration used throughout the app.
 * @type {Object}
 */
export default Ember.Service.extend({
  api: {
    url: 'http://localhost:8080'
  },
  auth: {
    url: 'http://localhost:8181/auth'
  },
  ws: {
    url: 'ws://localhost:8282'
  }
})
