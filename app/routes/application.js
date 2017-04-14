import Ember from 'ember'

/**
 * This is the first route that gets invoked when the user enters the app and
 * here checks are made to verify that the user is authenticated. If not, the
 * user is redirected to the login page.
 */
export default Ember.Route.extend({
  /**
   * sesison is used to check whether the user is authenticated.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * Before allowing access to the route, checks are made to verify that the
   * user is authenticated. If not the user is redirected to the login page.
   */
  beforeModel () {
    return this.get('session').login().catch(() => this.redirectToLogin())
  },

  /**
   * redirectToLogin redirects the user to the login page.
   */
  redirectToLogin () {
    window.location.assign('/login')
  }
})
