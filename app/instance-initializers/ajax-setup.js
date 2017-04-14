import Ember from 'ember'

/**
 * Instance Initializer used to setup default config for all AJAX Request.
 */
export function initialize () {
  Ember.$.ajaxSetup({
    xhrFields: {
      // Send cookies with AJAX Requests.
      withCredentials: true
    }
  })
}

export default {
  name: 'ajax-setup',
  initialize
}
