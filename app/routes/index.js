import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * session service is used to manage the session info.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  beforeModel () {
    // If the user is trying to access the login page while already
    // authenticated, he should be redirected to the chat.
    if (this.get('session').isLoggedIn() === true) this.transitionTo('chat')
  }
});
