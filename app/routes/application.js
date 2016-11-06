import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * session service is used to manage the session info.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  beforeModel () {
    // Try to login using cookie (if any).
    return this.get('session').login()
      .catch(() => {})
  }
});
