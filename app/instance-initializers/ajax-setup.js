/**
 * Instance Initializer used to setup default config for all ajax calls. 
 */
export function initialize() {
  Ember.$.ajaxSetup({
    xhrFields: {
      // Send cookies with ajax requests.
      withCredentials: true
    }
  })
}

export default {
  name: 'ajax-setup',
  initialize
};
