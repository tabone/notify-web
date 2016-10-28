import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * session service is used to manage the session info.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  beforeModel () {
    // If the user is trying to access the app while not authenticated, he
    // should be redirected to the login page.
    if (this.get('session').isLoggedIn() === false) this.transitionTo('login')
  }
});
