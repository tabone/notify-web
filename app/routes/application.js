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
    // Each time the user enters the app, the app should check if he is
    // authorized. If he isn't he should be redirected to the login page.
    return this.get('session').login()
      .catch(() => { window.location.assign('/login') })
  }
});
