import Ember from 'ember';

export default Ember.Service.extend({
  /**
   * token is provided by the API Server during autentication and it is used to
   * authenticate the user on each HTTP Request.
   * @type {String}
   */
  apiToken: null,

  /**
   * store used to retrieve the user object of the logged in user.
   * @type {service:store}
   */
  store: Ember.inject.service(),

  /**
   * user of the logged in user.
   * @type {String}
   */
  user: null,

  /**
   * isLoggedIn determines whether the user is logged in or not.
   * @return {Boolean} true if the user is logged in, false otherwise.
   */
  isLoggedIn () {
    return this.get('apiToken') !== null
  },

  /**
   * login the user.
   * @param  {String} username The username of the user.
   * @param  {String} password The password of the user.
   * @return {[type]}          [description]
   */
  login (username, password) {
    this.set('apiToken', 'abc123')
  },

  /**
   * logout the user.
   * @return {[type]} [description]
   */
  logout () {
    this.set('user', null)
    this.set('apiToken', null)
  }
});
