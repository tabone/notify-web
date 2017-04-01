import Ember from 'ember'

/**
 * This is the main route of the app. It is the first route that gets invoked
 * when a user enters the app. Here checks are made to verify that a user is
 * only allowed inside the app if he is authenticated.
 */
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
})
