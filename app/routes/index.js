import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * session service is used to manage the session info.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * beforeModel hook is the first of the route entry validation hooks called.
   */
  beforeModel () {
    // When the user enters the index page, if he is logged in, he should be
    // redirected to the app, else to the login page.
    if (this.get('session').isLoggedIn() === true) {
      this.transitionTo('chat')
    } else {
      window.location.assign('/login')
    }
  }
});
