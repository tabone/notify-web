import Ember from 'ember'
import RSVP from 'rsvp'

/**
 * Service used to manage the session.
 */
export default Ember.Service.extend({
  /**
   * configuration object.
   * @type {service:config}
   */
  config: Ember.inject.service(),

  /**
   * store service to query the Ember Data Repository.
   * @type {service:store}
   */
  store: Ember.inject.service(),

  /**
   * user record of the logged in user.
   * @type {String}
   */
  user: null,

  /**
   * isLoggedIn determines whether the user is logged in or not.
   * @return {Boolean} true if the user is logged in, false otherwise.
   */
  isLoggedIn () {
    return this.get('user') !== null
  },

  /**
   * login the user.
   * @param  {String} username The username of the user.
   * @param  {String} password The password of the user.
   * @return {Promise}         Resolved when authentication is successful,
   *                           rejected otherwise.
   */
  login () {
    return new RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: this.get('config.auth.url'),
        method: 'POST',
        dataType: 'json'
      }).then((data) => {
        return this.get('store')
          .findRecord('user', data.id, { include: 'unread' })
      }).then((user) => {
        this.set('user', user)
        resolve()
      }).fail(reject)
    })
  },

  /**
   * logout the user.
   */
  logout () {
    this.set('user', null)
  }
})
